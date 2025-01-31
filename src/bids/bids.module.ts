import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from '../entities/bid.entity';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { BidsGateway } from './bids.gateway';
import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Item, User]), // Import entities used in this module
  ],
  controllers: [BidsController], // Declare the controller
  providers: [BidsService, BidsGateway], // Declare the service and gateway
})
export class BidsModule {}