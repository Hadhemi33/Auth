
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-04-10',
      },
    );
  }

  async createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string,
  ): Promise<string> {
    const queryRunner = this.orderService
      .getRepository()
      .manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderService.getOrderById(orderId);

      if (!order) {
        throw new Error('Order not found');
      }
      if (order.paid === true) {
        throw new Error('deja payé');
      }
   
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
      });

      order.paid = true;
      await this.orderService.updateOrder(order);

      await queryRunner.commitTransaction();

      return paymentIntent.client_secret;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
