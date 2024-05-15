import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { CategoryModule } from 'src/category/category.module';
import { SpecialProductModule } from 'src/special-product/special-product.module';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { SpecialProductPriceService } from 'src/special-product-price/special-product-price.service';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      Notification,
      Order,
      Category,
      SpecialProductPrice,
      SpecialProduct,
    ]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  providers: [
    ProductResolver,
    ProductService,
    AuthService,
    NotificationService,
    UserService,
    JwtService,
    SpecialProductPriceService,
    SpecialProductService,
    CategoryService,
  ],
})
export class ProductModule {}
