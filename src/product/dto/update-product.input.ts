import { IsEnum, Length } from 'class-validator';

import { InputType, Field, ID } from '@nestjs/graphql';
import { ProductStatus } from '../product-status.enum';

@InputType()
export class UpdateProductInput {
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
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  nbrLike: number;
}
