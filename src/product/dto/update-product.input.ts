import { IsEnum, IsUUID, Length } from 'class-validator';

import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
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
  status: ProductStatus;
}
