import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  @Mutation(() => Chat)
  async createChat(
    @Args('name') name: string,
    @Args('memberIds', { type: () => [String] }) memberIds: string[],
  ): Promise<Chat> {
    return this.chatService.createChat(name, memberIds);
  }

  @Query(() => Chat)
  async getChat(@Args('id') id: string): Promise<Chat> {
    return this.chatService.getChat(id);
  }
}
