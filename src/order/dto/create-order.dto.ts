import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderDto {
  @Field()
  totalPrice: string;

  @Field()
  userId: string;

  @Field(() => [String])
  productIds: string[];
  @Field({ defaultValue: new Date().toISOString() })
  createdAt: string;
}
