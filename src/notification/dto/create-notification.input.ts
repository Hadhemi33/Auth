import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  specialProductPriceId?: string;
}
