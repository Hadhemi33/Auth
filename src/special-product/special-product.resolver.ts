import { Resolver, Mutation, Args, Query, Context, ID } from '@nestjs/graphql';
import { SpecialProductService } from './special-product.service';
import { SpecialProduct } from './entities/special-product.entity';
import { CreateSpecialProductInput } from './dto/create-special-product.input';
import { SetMetadata, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/get-current-user.decorator';
import { UpdateSpecialProductInput } from './dto/update-special-product.input';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Resolver(() => SpecialProduct)
export class SpecialProductResolver {
  constructor(private specialProductService: SpecialProductService) {}

  @Mutation(() => SpecialProduct)
  @UseGuards(JwtAuthGuard)
  async createSpecialProduct(
    @Args('createSpecialProductInput')
    createSpecialProductInput: CreateSpecialProductInput,
    @Context() context,
  ): Promise<SpecialProduct> {
    const user: User = context.req.user;

    if (!user) {
      throw new Error('You must be signed in to create a Special product');
    }

    return this.specialProductService.createSpecialProduct(
      createSpecialProductInput,
      user,
    );
  }
  @Query(() => [SpecialProduct])
  // // @UseGuards(JwtAuthGuard) //works
  async getAllSpecialProducts(
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
    @Args('title', { type: () => String, nullable: true }) title?: string,
    @Args('price', { type: () => String, nullable: true }) price?: string,
    @Args('categoryId', { type: () => String, nullable: true })
    categoryId?: string,
  ): Promise<SpecialProduct[]> {
    return this.specialProductService.getAllSpecialProducts(
      userId,
      categoryId,
      title,
      price,
    );
  }
  @Mutation(() => SpecialProduct)
  @UseGuards(JwtAuthGuard)
  async updateSpecialProduct(
    @CurrentUser() user: User,
    @Args('updateSpecialProductInput')
    updateSpecialProductInput: UpdateSpecialProductInput,
  ): Promise<SpecialProduct> {
    return this.specialProductService.updateSpecialProduct(
      updateSpecialProductInput,
      user,
    );
  }
  @Query(() => SpecialProduct)
  async specialProduct(@Args('id') id: string): Promise<SpecialProduct> {
    return this.specialProductService.getSpecialProductById(id);
  }
  @Query(() => [SpecialProduct], { name: 'expiredSpecialProducts' })
  async getExpiredSpecialProducts(): Promise<SpecialProduct[]> {
    return this.specialProductService.getExpiredSpecialProducts();
  }
  @Mutation(() => SpecialProduct)
  @UseGuards(JwtAuthGuard)

  // Guard to ensure user is authenticated
  async deleteSpecialProduct(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SpecialProduct> {
    return this.specialProductService.deleteSpecialProduct(id, user);
  }
  @Mutation(() => SpecialProduct)
  @UseGuards(JwtAuthGuard) // Guard to ensure user is authenticated
  async deleteSpeciaProductAdmin(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<SpecialProduct> {
    return this.specialProductService.deleteSpecialProductAdmin(id, user);
  }
  @Mutation(() => String)
  async deleteAllSpecialProduct(): Promise<string> {
    await this.specialProductService.deleteAll();
    return 'All special product  deleted successfully';
  }
}
