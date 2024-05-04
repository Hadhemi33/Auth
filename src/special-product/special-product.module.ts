import { Module, forwardRef } from '@nestjs/common';
import { SpecialProductService } from './special-product.service';
import { SpecialProductResolver } from './special-product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialProduct } from './entities/special-product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpecialProduct, User, Category]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  providers: [SpecialProductResolver, CategoryService, SpecialProductService],
})
export class SpecialProductModule {}
