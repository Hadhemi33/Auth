import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { Order } from 'src/order/entities/order.entity';
import { ProductService } from 'src/product/product.service';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { SpecialProductPriceService } from 'src/special-product-price/special-product-price.service';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      SpecialProduct,
      User,
      Product,
      Order,
      Notification,
      SpecialProductPrice,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    CategoryResolver,
    CategoryService,
    UserService,
    ProductService,
    JwtService,
    NotificationService,
    SpecialProductPriceService,
    SpecialProductService,
  ],
})
export class CategoryModule {}
