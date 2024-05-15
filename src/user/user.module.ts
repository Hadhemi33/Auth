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
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';

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
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    UserResolver,
    SpecialProductPriceService,
    SpecialProductService,
    CategoryService,
    NotificationService,
  ],
  exports: [UserService],
})
export class UserModule {}
