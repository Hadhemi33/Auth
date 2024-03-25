import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductStatus } from './product-status.enum';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/get-current-user.decorator';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // create(createProductInput: CreateProductInput) {
  //   return 'This action adds a new product';
  // }
  async getAllProducts(user): Promise<Product[]> {
    const products = await this.productRepository.find({ where: { user } });
    if (!products) {
      throw new InternalServerErrorException();
    }
    return products;
  }
  async createProduct(
    createProductInput: CreateProductInput,
    user: any,
  ): Promise<Product> {
    const { title, description } = createProductInput;
    const newProduct = this.productRepository.create({
      title,
      description,
      status: ProductStatus.InStock,
      createdAt: new Date().toISOString(),
      user,
    });
    try {
      await this.productRepository.save(newProduct);
      return newProduct;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async getProduct(id: string, user: User): Promise<Product> {
    const productFound = await this.productRepository.findOne({
      where: { id, user },
    });

    if (!productFound) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return productFound;
  }
  async updateProductStatus(
    updateProductInput: UpdateProductInput,
    user: User,
  ): Promise<Product> {
    const product = await this.getProduct(updateProductInput.id, user);
    const { title, description, status } = updateProductInput;
    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (status) {
      product.status = status;
    }
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async deleteProduct(id: string, user: User): Promise<Product> {
    const productFound: Product = await this.getProduct(id, user);
    const removedProductId = productFound.id;
    const result: Product = await this.productRepository.remove(productFound);

    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    result.id = removedProductId;
    return result;
  }

  // findAll() {
  //   return `This action returns all product`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: number, updateProductInput: UpdateProductInput) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
