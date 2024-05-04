import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  // @Length(3, 100)
  title: string;

  @Field()
  price?: string;
  @Field({ defaultValue: new Date().toISOString() })
  createdAt: string;
  @Field()
  description: string;

  @Field()
  categoryId: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  quantity: number;
}
