// import { Injectable } from '@nestjs/common';
// import { CreateChatInput } from './dto/create-chat.input';
// import { UpdateChatInput } from './dto/update-chat.input';
// import { Repository } from 'typeorm';
// import { Chat } from './entities/chat.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { EventsGateway } from 'src/events/events.gateway';

// @Injectable()
// export class ChatService {
//   constructor(
//     private eventGateway: EventsGateway,
//     @InjectRepository(Chat)
//     private messageRepository: Repository<Chat>,
//   ) {}

//   async sendMessage(senderId: string, input: CreateChatInput): Promise<Chat> {
//     const { receiverId, content } = input;
//     const newMessage = this.messageRepository.create({
//       senderId,
//       receiverId,
//       content,
//     } as Partial<Chat>);

//     const savedMessage = await this.messageRepository.save(newMessage);
//     this.eventGateway.sendMessage(savedMessage);
//     return savedMessage;
//   }

//   async getMessages(receiverId: string): Promise<Chat[]> {
//     return await this.messageRepository.find({ where: { receiverId } });
//   }
// }
