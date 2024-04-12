import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private messageRepository: Repository<Chat>,
  ) {}

  async sendMessage(senderId: string, input: CreateChatInput): Promise<Chat> {
    const { receiverId, content } = input;

    // Create a new chat message entity
    const newMessage = this.messageRepository.create({
      senderId,
      receiverId,
      content,
    } as Partial<Chat>);
    // Save the new message to the database
    const savedMessage = await this.messageRepository.save(newMessage);

    // Return the saved message
    return savedMessage;
  }

  async getMessages(receiverId: string): Promise<Chat[]> {
    return await this.messageRepository.find({ where: { receiverId } });
  }
}
