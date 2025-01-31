import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../entities/item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Bid } from '../entities/bid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Bid]), // Import entities used in this module
  ],
  controllers: [ItemsController], // Declare the controller
  providers: [ItemsService], // Declare the service
})
export class ItemsModule {}