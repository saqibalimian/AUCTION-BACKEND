import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';
import { UsersSeeder } from './users/seeds/users.seed';


import * as dotenv from 'dotenv';
import { UsersModule } from './users/users.module';


dotenv.config();

console.log(`DB_URL: ${process.env.DB_URL}`);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development; disable in production
      ssl: {
        rejectUnauthorized: false, // Disable SSL certificate validation (not recommended for production)
      },
      logging: true, // Enable logging for debugging
    }),
    UsersModule,
    ItemsModule,
    BidsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}