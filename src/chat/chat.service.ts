import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createChat(name: string, memberIds: string[]): Promise<Chat> {
    // Check if a chat with the same members already exists
    const existingChat = await this.getAllChat(memberIds);
    console.log('existingChat', existingChat);
    if (existingChat.length > 0) {
      throw new Error('A chat with the same members already exists');
    }

    // Retrieve the members from the database
    const members = await this.userRepository.findByIds(memberIds);
    if (members.length !== memberIds.length) {
      throw new NotFoundException('Some members not found');
    }

    // Create and save the new chat
    const chat = this.chatRepository.create({ name, members });
    return this.chatRepository.save(chat);
  }

  async getAllChat(memberIds: string[]): Promise<Chat[]> {
    const numericMemberIds = memberIds.map((id) => parseInt(id, 10));
    console.log('numericMemberIds', numericMemberIds);
    const chats = await this.chatRepository.find({ relations: ['members'] });
    console.log('chats', chats);

    const existingChats = chats.filter((chat) => {
      const chatMemberIds = chat.members.map((member) => member.id).sort();
      console.log(
        'chatMemberIds',
        chatMemberIds,
        'memberIds',
        numericMemberIds,
      );
      if (
        JSON.stringify(chatMemberIds) ===
        JSON.stringify(numericMemberIds.sort())
      ) {
        //   if (chatMemberIds.every((id, index) => id === memberIds[index])) {
        console.log(JSON.stringify(chatMemberIds));
        console.log(JSON.stringify(numericMemberIds.sort()));
        return chat;
      }
    });

    return existingChats;
  }

  //   private async findChatByMembers(
  //     memberIds: string[],
  //   ): Promise<Chat | undefined> {
  //     // Retrieve all chats
  //     const chats = await this.chatRepository.find({ relations: ['members'] });

  //     // Find a chat that includes all the provided members
  //     const chat = chats.find((chat) => {
  //       // Check if the chat has the same number of members as the provided memberIds
  //       if (chat.members.length !== memberIds.length) {
  //         console.log('same memberssssssssss');
  //         return false;
  //       }

  //       // Check if all provided memberIds are present in the chat's members
  //       const chatMemberIds = chat.members.map((member) => member.id);
  //       return memberIds.every((id) => chatMemberIds.includes(id));
  //     });

  //     return chat;
  //   }

  async getChat(id: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }
}
