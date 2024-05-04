// special-product.resolver.ts
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { SpecialProductService } from './special-product.service';
import { SpecialProduct } from './entities/special-product.entity';
import { CreateSpecialProductInput } from './dto/create-special-product.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => SpecialProduct)
export class SpecialProductResolver {
  constructor(private readonly specialProductService: SpecialProductService) {}
  @Mutation(() => SpecialProduct)
  @UseGuards(JwtAuthGuard)
  async createSpecialProduct(
    @Args('createSpecialProductInput')
    createSpecialProductInput: CreateSpecialProductInput,
    @Context() context,
  ): Promise<SpecialProduct> {
    const user: User = context.req.user;
    if (!user) {
      throw new Error('You must be signed in to create a product');
    }

    return this.specialProductService.createSpecialProduct(
      createSpecialProductInput,
      user,
    );
  }
}
