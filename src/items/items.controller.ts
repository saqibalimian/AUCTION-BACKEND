import {  Logger } from '@nestjs/common';

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  private readonly logger = new Logger(ItemsService.name);

  constructor(private readonly itemsService: ItemsService) {}

  // Add a new item to the auction
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    this.logger.log(`Item Controller: ${JSON.stringify(createItemDto)}`);
   
    return this.itemsService.addItem(createItemDto);
  }

  // Get all items available for auction
  @Get()
  getItems() {
    return this.itemsService.getItems();
  }

  // Get details of a specific item, including the current highest bid and remaining time
  @Get(':id')
  getItem(@Param('id') id: number) {
    return this.itemsService.getItemWithDetails(id);
  }
}