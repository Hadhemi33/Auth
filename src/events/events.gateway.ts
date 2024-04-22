import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents } from './types/events';

import { Chat } from 'src/chat/entities/chat.entity';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws-jwt/ws.mw';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WsJwtGuard)
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;
  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    Logger.log('I am here');
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  sendMessage(message: Chat) {
    this.server.emit('newMessage', message);
  }
}
