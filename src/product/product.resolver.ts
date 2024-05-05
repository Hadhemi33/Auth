import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { User } from 'src/user/entities/user.entity';
import { createWriteStream } from 'fs';
import { CurrentUser } from 'src/auth/get-current-user.decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetMetadata, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private productService: ProductService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['user'])
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @Context() context,
  ): Promise<Product> {
    const user: User = context.req.user;
    if (!user) {
      throw new Error('You must be signed in to create a product');
    }

    return this.productService.create(createProductInput, user);
  }

  @Query(() => [Product])
  // @UseGuards(JwtAuthGuard)  //works
  async getAllProducts(
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
    @Args('title', { type: () => String, nullable: true }) title?: string,
    @Args('price', { type: () => String, nullable: true }) price?: string,
    @Args('categoryId', { type: () => String, nullable: true })
    categoryId?: string,
  ): Promise<Product[]> {
    return this.productService.getAllProducts(userId, categoryId, title, price);
  }
  @Query(() => Product)
  async getProduct(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.getProductUserById(id, user);
  }

  @Mutation(() => Product)
  async uploadProductImage(
    @Args('productId', { type: () => ID }) productId: number,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<Product> {
    const { createReadStream, filename } = file;
    const filePath = join(__dirname, '..', 'uploads', filename);

    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject);
    });

    const product = await this.productService.getProductUserById(
      productId.toString(),
      null,
    );
    const imageUrl = `/uploads/${filename}`;
    product.imageUrl = imageUrl;

    await this.productRepository.save(product);

    return product;
  }
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @CurrentUser() user: User,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.updateProduct(updateProductInput, user);
  }

  // @Mutation(() => Product)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @SetMetadata('roles', ['admin'])
  // async deleteProduct(
  //   @CurrentUser() user: User,
  //   @Args('id', { type: () => String }) id: string,
  // ): Promise<Product> {

  //   return this.productService.deleteProduct(id, user);
  // }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Product> {
    const product = await this.productService.getProductById(id);

    if (user.roles === 'admin' || user.id === product.user.id) {
      return this.productService.deleteProduct(id, user);
    } else {
      throw new UnauthorizedException(
        'You are not authorized to delete this product',
      );
    }
  }
  @Mutation(() => Product)
  async likeProduct(
    @Args({ name: 'productId', type: () => ID }) productId: string,
    @Args({ name: 'userId', type: () => ID }) userId: string,
  ): Promise<Product> {
    return this.productService.likeProduct(productId, userId);
  }

  @Mutation(() => Product)
  async dislikeProduct(
    @Args({ name: 'productId', type: () => ID }) productId: string,
    @Args({ name: 'userId', type: () => ID }) userId: string,
  ): Promise<Product> {
    return this.productService.dislikeProduct(productId, userId);
  }
}
