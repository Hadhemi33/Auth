import { Module, forwardRef } from '@nestjs/common';
import { SpecialProductPriceService } from './special-product-price.service';
import { SpecialProductPriceResolver } from './special-product-price.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialProductPrice } from './entities/special-product-price.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';

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
    SpecialProductPriceResolver,
    SpecialProductPriceService,
    UserService,
    AuthService,
    SpecialProductService,
    SpecialProduct,
    UserModule,
    CategoryService,
    JwtService,
  ],
})
export class SpecialProductPriceModule {}
