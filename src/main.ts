import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { UsersSeeder } from './users/seeds/users.seed';
import { BidsGateway } from './bids/bids.gateway';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable all log levels
  });
    // Explicitly use body-parser middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
 
  // Seed users
  //const seeder = app.get(UsersSeeder);
  //await seeder.seed();
  // Enable CORS globally
  app.enableCors({
    origin: '*', // Allow all origins (use specific origins in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  });
  // Enable validation globally


    // Emit a test event after the server starts
    const bidsGateway = app.get(BidsGateway);
    setTimeout(() => {
      bidsGateway.emitBidUpdate({ message: 'Test WebSocket event' });
    }, 5000); // Emit after 5 seconds


    // Enable CORS for HTTP requests
    app.enableCors({
      origin: '*', // Allow all origins (use specific origins in production)
      
    });
  
    // Use the Socket.IO adapter for WebSockets
    app.useWebSocketAdapter(new IoAdapter(app));


  app.use((req, res, next) => {
    Logger.log(`Raw Request Body: ${JSON.stringify(req.body)}`);
    next();
  });
 // Logger.log('Application is running on: http://localhost:3000');
  await app.listen(3001);
}
bootstrap();