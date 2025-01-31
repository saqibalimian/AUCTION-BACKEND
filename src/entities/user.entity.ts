import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bid } from './bid.entity'; // Import the Bid entity

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Bid, (bid) => bid.user) // Define the one-to-many relationship
  bids: Bid[];
}