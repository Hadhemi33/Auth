import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChatInput {
  @Field()
  receiverId: string;
  @Field()
  content: String;
}
