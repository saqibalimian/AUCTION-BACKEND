import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersSeeder } from './seeds/users.seed'; // Import the UsersSeeder

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity
  providers: [UsersSeeder], // Register the seeder as a provider
})
export class UsersModule {}