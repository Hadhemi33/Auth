import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { OrderService } from 'src/order/order.service';
import { Order } from 'src/order/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderHistory, Payment, Product]),
    forwardRef(() => AuthModule),
    UserModule,
    OrderModule,
  ],

  providers: [PaymentResolver, PaymentService, OrderService],
})
export class PaymentModule {}
