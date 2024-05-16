import { IsEnum, Length } from 'class-validator';
import { CreateSpecialProductInput } from './create-special-product.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateSpecialProductInput extends PartialType(
  CreateSpecialProductInput,
) {
  @Field(() => ID)
  id: string;
  @Field({ nullable: true })
  @Length(3, 100)
  title?: string;

  @Field()
  description?: string;

  @Field()
  price?: string;
  @Field()
  discount?: string;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  imageUrl?: string;


}
