import { CreateSpecialProductInput } from './create-special-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSpecialProductInput extends PartialType(CreateSpecialProductInput) {
  @Field(() => Int)
  id: number;
}
