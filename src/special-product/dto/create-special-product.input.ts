import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateSpecialProductInput {
  @Field()
  @Length(3, 100)
  title: string;

  @Field()
  price: string;
  @Field()
  description: string;
  @Field({ defaultValue: new Date().toISOString() })
  createdAt: string;
  @Field()
  discount: string;
  @Field()
  endingIn: string;
  @Field()
  categoryId: string;
  @Field({ nullable: true })
  imageUrl?: string;
}
