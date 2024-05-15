import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { SpecialProductPriceService } from 'src/special-product-price/special-product-price.service';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      User,
      Notification,
      Category,
      OrderHistory,
      SpecialProduct,
      SpecialProductPrice,
    ]),
  ],
  providers: [
    OrderResolver,
    OrderService,
    ProductService,
    UserService,
    CategoryService,
    SpecialProductService,
    SpecialProductPriceService,
    OrderHistoryService,
    NotificationService,
  ],
})
export class OrderModule {}
