import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateSpecialProductInput {
  @Field()
  @Length(3, 100)
  title: string;
  @Field()
  price?: string;
  @Field()
  description: string;
  @Field()
  discount: number;
  @Field()
  time: string;
  @Field(() => [ID])
  categories: string[];
}
