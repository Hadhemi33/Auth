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

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User, Category,OrderHistory])],
  providers: [
    OrderResolver,
    OrderService,
    ProductService,
    UserService,
    CategoryService,
    OrderHistoryService,
  ],
})
export class OrderModule {}
