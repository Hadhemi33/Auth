import { InputType, Field, ID } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';

@InputType()
export class CreateProductInput {
  @Field()
  @Length(3, 100)
  title: string;
  @Field()
  price?: string;
  @Field()
  description: string;

  @Field(() => [ID])
  categories: string[];

  @Field({ nullable: true })
  imageUrl?: string; // New field for image URL
}
