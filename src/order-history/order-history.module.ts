import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryResolver } from './order-history.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { OrderHistory } from './entities/order-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User, Category,OrderHistory])],
  providers: [OrderHistoryResolver, OrderHistoryService],
})
export class OrderHistoryModule {}
