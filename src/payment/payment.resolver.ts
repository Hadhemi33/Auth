import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => String)
  async createPaymentIntent(
    @Args('amount') amount: number,
    @Args('currency') currency: string,
  ): Promise<string> {
    const paymentIntent = await this.paymentService.createPaymentIntent(
      amount,
      currency,
    );
    return paymentIntent.client_secret;
  }
}
