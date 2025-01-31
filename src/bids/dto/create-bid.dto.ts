import { IsNumber } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  item_id: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  amount: number;
}