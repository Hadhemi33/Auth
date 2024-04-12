import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly messageService: ChatService) {}

  @Mutation(() => Chat)
  async sendMessage(
    @Args('senderId') senderId: string,
    @Args('input') input: CreateChatInput,
  ): Promise<Chat> {
    return await this.messageService.sendMessage(senderId, input);
  }

  @Query(() => [Chat])
  async getMessages(@Args('receiverId') receiverId: string): Promise<Chat[]> {
    return await this.messageService.getMessages(receiverId);
  }
}
