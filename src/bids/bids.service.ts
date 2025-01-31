import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from '../entities/bid.entity';
import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { BidsGateway } from './bids.gateway';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bidsGateway: BidsGateway, // Inject WebSocket gateway
  ) {}

  async placeBid(createBidDto: CreateBidDto) {
    const { item_id, user_id, amount } = createBidDto;

    // Fetch the item
    const item = await this.itemRepository.findOne({
      where: { id: item_id },
      relations: ['bids'], // Include related bids
    });

    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    // Fetch the user
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if the auction has expired
    const now = new Date();
    if (now > item.auction_duration) {
      return { success: false, message: 'Auction has ended' };
    }

    // Calculate the current highest bid
    const currentHighestBid = Math.max(
      item.starting_price,
      ...(item.bids || []).map((bid) => bid.amount),
    );

    // Check if the bid is higher than the current highest bid
    if (amount <= currentHighestBid) {
      return {
        success: false,
        message: 'Bid must be higher than the current highest bid',
      };
    }

    // Save the new bid
    const newBid = this.bidRepository.create({
      ...createBidDto,
      timestamp: now,
      user, // Associate the user with the bid
    });
    await this.bidRepository.save(newBid);

    // Notify clients via WebSocket
    this.bidsGateway.server.emit('bidUpdate', {
      item_id,
      user_id,
      amount,
      timestamp: now.toISOString(),
    });

    return { success: true, message: 'Bid placed successfully' };
  }
}