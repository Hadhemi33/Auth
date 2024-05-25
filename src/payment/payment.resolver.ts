
import { Resolver, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => String)
  async createPaymentIntent(
    @Args('orderId', { type: () => ID }) orderId: string,
    @Args('amount', { type: () => Float }) amount: number,
    @Args('currency') currency: string,
  ): Promise<string> {
    return this.paymentService.createPaymentIntent(orderId, amount, currency);
  }
}
