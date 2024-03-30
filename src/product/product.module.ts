import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, Order, Category]),
  ],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
