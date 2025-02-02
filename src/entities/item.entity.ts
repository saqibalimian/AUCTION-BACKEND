import { Entity, PrimaryGeneratedColumn, Column, OneToMany ,VersionColumn} from 'typeorm';
import { Bid } from './bid.entity'; // Import the Bid entity

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  starting_price: number;

  @Column('timestamp')
  auction_duration: Date;

  @OneToMany(() => Bid, (bid) => bid.item)
  bids: Bid[];

  @VersionColumn() // Add this for optimistic locking
  version: number;
}