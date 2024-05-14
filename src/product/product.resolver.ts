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
import * as fs from 'fs';
import * as path from 'path';

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

  // @Mutation(() => Product)
  // async uploadProductImage(
  //   @Args('productId', { type: () => ID }) productId: number,
  //   @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  // ): Promise<Product> {
  //   const { createReadStream, filename } = file;
  //   const filePath = join(__dirname, '..', 'uploads', filename);

  //   await new Promise((resolve, reject) => {
  //     createReadStream()
  //       .pipe(createWriteStream(filePath))
  //       .on('finish', resolve)
  //       .on('error', reject);
  //   });

  //   const product = await this.productService.getProductUserById(
  //     productId.toString(),
  //     null,
  //   );
  //   const imageUrl = `/uploads/${filename}`;
  //   product.imageUrl = imageUrl;

  //   await this.productRepository.save(product);

  //   return product;
  // }
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RoleGuard)
  // @SetMetadata('roles', ['admin'])
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

  // @Mutation(() => Product)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @SetMetadata('roles', ['admin'])
  // async deleteProduct(
  //   @CurrentUser() user: User,
  //   @Args('id', { type: () => String }) id: string,
  // ): Promise<Product> {
  //   const product = await this.productService.getProductById(id);

  //   if (user.roles === 'admin' || user.id === product.user.id) {
  //     return this.productService.deleteProduct(id, user);
  //   } else {
  //     throw new UnauthorizedException(
  //       'You are not authorized to delete this product',
  //     );
  //   }
  // }
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard) // Guard to ensure user is authenticated
  async deleteProduct(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.deleteProduct(id, user);
  }
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard) // Guard to ensure user is authenticated
  async deleteProductAdmin(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.deleteProductAdmin(id, user);
  }

  // @Mutation(() => Boolean)
  // async uploadFile(
  //   @Args({ name: 'file', type: () => GraphQLUpload })
  //   file: FileUpload,
  // ): Promise<boolean> {
  //   const { createReadStream, filename } = file;
  //   const stream = createReadStream();
  //   const outPath = path.join(__dirname, '..', 'uploads', filename);
  //   const outStream = fs.createWriteStream(outPath);

  //   return new Promise((resolve, reject) => {
  //     stream
  //       .pipe(outStream)
  //       .on('finish', () => resolve(true))
  //       .on('error', (error) => reject(false));
  //   });
  // }
  // @Mutation(() => Boolean) // Mutation qui retourne un booléen
  // async uploadFile(
  //   @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  // ): Promise<boolean> {
  //   const { createReadStream, filename } = file;

  //   // Enregistrement du fichier
  //   const stream = createReadStream();
  //   const filePath = `./uploads/${filename}`;

  //   const out = require('fs').createWriteStream(filePath);
  //   stream.pipe(out);

  //   await new Promise((resolve, reject) => {
  //     out.on('finish', resolve);
  //     out.on('error', reject);
  //   });

  //   console.log(`File uploaded: ${filename}`);
  //   return true; // Retourne "true" pour indiquer le succès
  // }
}
