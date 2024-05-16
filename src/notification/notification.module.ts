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
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SpecialProductPrice,
      SpecialProduct,
      Notification,
      Category,
    ]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  providers: [
    NotificationResolver,
    NotificationService,
    CategoryService,
    UserService,
    AuthService,
    SpecialProductPriceService,
    SpecialProductService,

    JwtService,
  ],
})
export class NotificationModule {}
