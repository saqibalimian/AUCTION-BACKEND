import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const users: Partial<User>[] = [];
    for (let i = 1; i <= 100; i++) {
      users.push({ name: `User ${i}` });
    }
    await this.userRepository.save(users);
    console.log('Seeded 100 users');
  }
}




