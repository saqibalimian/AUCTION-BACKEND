import { Injectable,Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  // Add a new item to the database
  async addItem(createItemDto: CreateItemDto) {
    const newItem = this.itemRepository.create(createItemDto);
    return this.itemRepository.save(newItem);
  }

  // Get all items with their related bids
  async getItems() {
    return this.itemRepository.find({ relations: ['bids'] });
  }

  // Get details of a specific item, including the current highest bid and remaining time
  async getItemWithDetails(id: number) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['bids'],
    });

    if (!item) {
      throw new Error('Item not found');
    }

    // Calculate the current highest bid
    const currentHighestBid = Math.max(
      item.starting_price,
      ...(item.bids || []).map((bid) => bid.amount),
    );

    // Calculate the remaining time for the auction
    const now = new Date().getTime();
    const remainingTime = item.auction_duration.getTime() - now;

    return {
      ...item,
      current_highest_bid: currentHighestBid,
      remaining_time: remainingTime > 0 ? remainingTime : 0, // Return 0 if the auction has ended
    };
  }
}