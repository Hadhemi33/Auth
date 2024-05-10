import { CreateOrderHistoryInput } from './create-order-history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderHistoryInput extends PartialType(CreateOrderHistoryInput) {
  @Field(() => Int)
  id: number;
}
