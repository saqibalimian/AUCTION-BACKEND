import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Bid } from '../entities/bid.entity';
import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { BidsGateway } from './bids.gateway';

@Injectable()
export class BidsService {
  private readonly logger = new Logger(BidsService.name);

  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bidsGateway: BidsGateway,
    private readonly connection: Connection,
  ) {}

  async placeBid(createBidDto: CreateBidDto) {
    const { item_id, user_id, amount } = createBidDto;

    // Step 1: Perform transactional logic
    return this.connection.transaction(async (manager) => {
      try {
        // Fetch the item with optimistic locking
        const item = await manager.getRepository(Item).findOne({
          where: { id: item_id },
           });

        if (!item) {
          return { success: false, message: 'Item not found' };
        }
      // Apply optimistic locking
      const lockedItem = await manager.getRepository(Item).findOne({
        where: { id: item_id },
        lock: { mode: 'optimistic', version: item.version },
      });

      if (!lockedItem) {
        return { success: false, message: 'Item not found after locking' };
      }

        // Check if auction is still active
        const now = new Date();
        if (now > item.auction_duration ) {
          return { success: false, message: 'Auction has ended' };
        }

        // Fetch latest highest bid inside the transaction
        const latestBid = await manager
          .getRepository(Bid)
          .createQueryBuilder('bid')
          .select('MAX(bid.amount)', 'maxAmount')
          .where('bid.item.id = :itemId', { itemId: item_id })
          .getRawOne();

        const latestHighestBid = Math.max(item.starting_price, latestBid?.maxAmount || 0);

        if (amount <= latestHighestBid) {
          return { success: false, message: 'Bid amount must be higher' };
        }

        // Fetch user within the transaction
        const user = await manager.getRepository(User).findOne({ where: { id: user_id } });
        if (!user) {
          return { success: false, message: 'User not found' };
        }

        // Create and save the new bid
        const bid = manager.getRepository(Bid).create({
          amount,
          timestamp: now,
          item,
          user,
        });
        await manager.getRepository(Bid).save(bid);

        // Save item to trigger optimistic locking
        await manager.getRepository(Item).save(item);

        return { success: true, bid };
      } catch (error) {
        if (error.name === 'OptimisticLockVersionMismatchError') {
          return { success: false, message: 'Item was updated by another transaction, please retry' };
        }
        this.logger.error(`Error placing bid: ${error.message}`);
        throw new Error('Failed to place bid');
      }
    }).then((result) => {
      // Step 4: Emit event after transaction success
      if (result.success) {
         // Notify clients via WebSocket
        this.bidsGateway.server.emit('bidUpdate', {
          item_id,
          user_id,
          amount
        });
       
        this.logger.log(`Bid update event emitted: bid_id=${result.bid?.id}`);
      
      }
      return result;
    });
  }
}
