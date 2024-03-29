import { InputType, Field, ID } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @Length(3, 100)
  title: string;
  @Field()
  price?: string;
  @Field()
  description: string;
  @Field(() => ID)  
  category: string;
}
