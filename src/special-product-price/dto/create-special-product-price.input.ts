import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateSpecialProductPriceInput {
  @Field(() => ID)
  specialProductId: string;

  @Field({ nullable: true })
  userId: string;

  @Field()
  price: string;
}
