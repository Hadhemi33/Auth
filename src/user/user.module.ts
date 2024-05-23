import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { SpecialProductPriceService } from 'src/special-product-price/special-product-price.service';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { CategoryService } from 'src/category/category.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { OrderService } from 'src/order/order.service';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/payment/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Category,
      Order,
      Product,
      Notification,
      SpecialProduct,
      SpecialProductPrice,
      Payment,
      OrderHistory,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    UserResolver,
    NotificationService,
    SpecialProductPriceService,
    SpecialProductService,
    CategoryService,
    OrderService,
    PaymentService,
    OrderHistoryService,
  ],
  exports: [UserService],
})
export class UserModule {}
