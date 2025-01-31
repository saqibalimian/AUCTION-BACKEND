import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  starting_price: number;

  @IsDate()
  auction_duration: Date;
}