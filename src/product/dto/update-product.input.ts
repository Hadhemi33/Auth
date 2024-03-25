import { IsEnum, IsUUID, Length } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { ProductStatus } from '../product-status.enum';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  @IsUUID('4', { each: true })
  id: string;
  @Field({ nullable: true })
  @Length(3, 100)
  title?: string;

  @Field()
  description?: string;
  @Field()
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
