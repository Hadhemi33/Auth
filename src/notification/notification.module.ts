import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { SpecialProductPriceService } from 'src/special-product-price/special-product-price.service';
import { Notification } from './entities/notification.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { SpecialProductModule } from 'src/special-product/special-product.module';
import { SpecialProductPriceModule } from 'src/special-product-price/special-product-price.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SpecialProductPrice,
      SpecialProduct,
      Product,
      Notification,
      Category,
    ]),
    forwardRef(() => AuthModule),
    UserModule,
    SpecialProductModule,
    SpecialProductPriceModule,
    
  ],
  providers: [
    NotificationResolver,
    NotificationService,
    CategoryService,
    UserService,
    ProductService,
    AuthService,
    SpecialProductPriceService,
    SpecialProductService,
    JwtService,
  ],
})
export class NotificationModule {}
