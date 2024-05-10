import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@ObjectType()
export class SignupResponse {
  @Field(() => ID)
  id: string;
  @Field()
  username: string;

  @Field({ nullable: true })
  @IsOptional()
  fullName?: string;

  @Field({ nullable: true })
  phoneNumber: string;
  @Field()
  roles: string;

  @Field({ nullable: true })
  imageUrl?: string;
}
