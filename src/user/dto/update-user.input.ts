import { IsUUID } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {

  @Field({ nullable: true })
  fullName?: string;
  @Field({ nullable: true })
  username?: string;
  @Field({ nullable: true })
  password?: string;
  @Field({ nullable: true })
  phoneNumber?: string;
  @Field({ nullable: true })
  roles?: string;
  @Field({ nullable: true })
  imageUrl?: string;
  @Field({ nullable: true })
  address?: string;
}
