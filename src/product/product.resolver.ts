import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/get-current-user.decorator';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.createProduct(createProductInput, user);
  }

  @Query(() => [Product])
  async getAllProducts(@CurrentUser() user: User): Promise<Product[]> {
    console.log('Current User:', user);
    return this.productService.getAllProducts(user);
  }
  @Query(() => Product)
  async getProduct(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.getProduct(id, user);
  }
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @CurrentUser() user: User,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.updateProductStatus(updateProductInput, user);
  }
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Product> {
    return this.productService.deleteProduct(id, user);
  }
}
