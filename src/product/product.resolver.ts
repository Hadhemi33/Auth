import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
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

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private productService: ProductService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // @Mutation(() => Product)
  // // @UseGuards(JwtAuthGuard, RoleGuard)
  // // @SetMetadata('roles', ['user'])
  // async createProduct(
  //   @Args('createProductInput') createProductInput: CreateProductInput,
  //   @CurrentUser() user: User,
  // ): Promise<Product> {
  //   return this.productService.createProduct(createProductInput, user);
  // }

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.createProduct(createProductInput, user);
  }

  @Query(() => [Product], { name: 'getAllProducts' })
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Query(() => Product)
  async getProduct(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.getProduct(id, user);
  }

  @Mutation(() => Product)
  async uploadProductImage(
    @Args('productId', { type: () => ID }) productId: number,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<Product> {
    const { createReadStream, filename } = file;
    const filePath = join(__dirname, '..', 'uploads', filename);

    // Save the uploaded file
    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject);
    });

    // Update the product with the image URL
    // const product = await this.productRepository.findOne({
    //   where: { ID },
    // });
    const product = await this.productService.getProduct(
      productId.toString(),
      null,
    );
    const imageUrl = `/uploads/${filename}`;
    product.imageUrl = imageUrl;

    await this.productRepository.save(product);

    return product;
  }
  // @Mutation(() => Product)
  // // @UseGuards(JwtAuthGuard)
  async updateProduct(
    @CurrentUser() user: User,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.updateProductStatus(updateProductInput, user);
  }
  // @Mutation(() => Product)
  // async updateProduct(
  //   @CurrentUser() user: User,
  //   @Args('updateProductInput') updateProductInput: UpdateProductInput,
  // ): Promise<Product> {
  //   return this.productService.updateProductStatus(updateProductInput, user);
  // }
  @Mutation(() => Product)
  // @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Product> {
    return this.productService.deleteProduct(id, user);
  }
}
