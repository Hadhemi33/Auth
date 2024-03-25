import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @Length(3, 100)
  title: string;
  @Field()
  description: string;
}
