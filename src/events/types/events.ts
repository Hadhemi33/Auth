import { Chat } from 'src/chat/entities/chat.entity';

export interface ServerToClientEvents {
  newMessage: (payload: Chat) => void;
}
