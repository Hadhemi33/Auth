import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { User } from 'src/user/entities/user.entity';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { Category } from 'src/category/entities/category.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { SpecialProductPriceService } from 'src/special-product-price/special-product-price.service';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpecialProductPrice,
      User,
      SpecialProduct,
      Category,
    ]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  providers: [
    NotificationResolver,
    UserService,
    SpecialProductPriceService,
    NotificationService,
    CategoryService,
    SpecialProductService,
  ],
})
export class NotificationModule {}
