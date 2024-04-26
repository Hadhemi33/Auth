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

import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }
  async createProduct(
    createProductInput: CreateProductInput,
    user: any,
  ): Promise<Product> {
    const { title, description, price } = createProductInput;

    const newProduct = this.productRepository.create({
      title,
      description,
      price,
      status: ProductStatus.InStock,
      createdAt: new Date().toISOString(),
      user,
      order: null,

      categories: [],
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
    const { title, description, status, price } = updateProductInput;
    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
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
}
