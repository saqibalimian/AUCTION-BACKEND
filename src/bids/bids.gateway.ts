import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, ConnectedSocket, MessageBody,OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class BidsGateway implements OnGatewayInit , OnGatewayConnection, OnGatewayDisconnect  {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BidsGateway.name); // Create a logger instance

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized'); // Log initialization
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  emitBidUpdate(data: any) {
    this.logger.log(`Emitting bidUpdate event: ${JSON.stringify(data)}`); // Log the event
    this.server.emit('bidUpdate', data);
  }

  @SubscribeMessage('newBid')
  handleNewBid(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
    this.logger.log(`Received newBid event: ${JSON.stringify(payload)}`); // Log the received payload
    this.server.emit('bidUpdate', payload); // Broadcast the event to all clients
  }
}