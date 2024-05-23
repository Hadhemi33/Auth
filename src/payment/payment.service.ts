// import { Injectable } from '@nestjs/common';
// import { CreatePaymentInput } from './dto/create-payment.input';
// import { UpdatePaymentInput } from './dto/update-payment.input';
// import Stripe from 'stripe';
// import { ConfigService } from '@nestjs/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Order } from 'src/order/entities/order.entity';
// import { Repository } from 'typeorm';
// @Injectable()
// export class PaymentService {
//   private stripe: Stripe;

//   constructor(private configService: ConfigService ,
//     @InjectRepository(Order) private orderRepository: Repository<Order>,
//   ) {
//     this.stripe = new Stripe(
//       this.configService.get<string>('STRIPE_SECRET_KEY'),
//       {
//         apiVersion: '2024-04-10',
//       },
//     );
//   }

//   async createPaymentIntent(
//     amount: number,
//     currency: string,
//   ): Promise<Stripe.PaymentIntent> {
//     return await this.stripe.paymentIntents.create({
//       amount,
//       currency,
//     });
//   }
// }
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

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
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
