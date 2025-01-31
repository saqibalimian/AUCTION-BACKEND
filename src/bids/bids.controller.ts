import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async placeBid(@Body() createBidDto: CreateBidDto) {
    const result = await this.bidsService.placeBid(createBidDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}