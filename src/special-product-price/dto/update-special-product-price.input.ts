import { CreateSpecialProductPriceInput } from './create-special-product-price.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateSpecialProductPriceInput extends PartialType(
  CreateSpecialProductPriceInput,
) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  price?: string;

}
