// filepath: /c:/Users/PROBOOK/auction-backend/src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bidding System!';
  }
}