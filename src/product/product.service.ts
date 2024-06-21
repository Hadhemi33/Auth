import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, Between, Like } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private categoryService: CategoryService,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    user: User,
  ): Promise<Product> {
    try {
      const category = await this.categoryService.getCategoryById(
        createProductInput.categoryId,
      );
      if (!category) {
        throw new Error(
          `Category with ID ${createProductInput.categoryId} does not exist.`,
        );
      }

      const newProduct = this.productRepository.create(createProductInput);
      newProduct.user = user;
      newProduct.category = category;

      const savedProduct = await this.productRepository.save(newProduct);
      user.products.push(savedProduct);
      await this.userRepository.save(user);

      return savedProduct;
    } catch (error) {
      console.error('Error during product creation:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the product.',
      );
    }
  }

  async getAllProducts(
    userId?: string,
    categoryId?: string,
    title?: string,
    price?: string,
  ): Promise<Product[]> {
    const query: any = {};

    if (userId) {
      query.user = { id: userId };
    }
    if (categoryId) {
      query.category = { id: categoryId };
    }
    if (title) {
      query.title = title;
    }
    if (price) {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) {
        throw new Error('Price must be a valid number');
      }

      const lowerBound = Math.floor(numericPrice);
      const upperBound = Math.ceil(numericPrice + 1) - 0.01;

      if (numericPrice % 1 === 0) {
        query.price = Between(lowerBound, upperBound);
      } else {
        query.price = Like(`${numericPrice}%`);
      }
    }
    try {
      const products = await this.productRepository.find({
        where: query,
        relations: ['user', 'category'],
      });

      if (products.length === 0) {
        throw new NotFoundException('No products found');
      }

      return products;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  ///////////////////////////deleteProduct/////////////////////////

  async deleteProduct(id: string, user: User): Promise<Product> {
    try {
      const productFound: Product = await this.getProductUserById(id, user);

      const removedProductId = productFound.id;

      if (
        user.roles === 'admin' ||
        user.id === productFound.user.id ||
        user.roles === 'subadmin'
      ) {
        const result: Product =
          await this.productRepository.remove(productFound);

        if (!result) {
          throw new NotFoundException(`Product with id ${id} not found`);
        }

        result.id = removedProductId;
        return result;
      } else {
        throw new UnauthorizedException(
          'You are not authorized to delete this product',
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the product.',
      );
    }
  }

  ///////////////////////////getProductById/////////////////////////

  async getProductUserById(id: string, user: User): Promise<Product> {
    const productFound = await this.productRepository.findOne({
      where: { id, user },
      relations: ['user', 'category'],
    });

    if (!productFound) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return productFound;
  }

  ///////////////////////////UpdateProduct/////////////////////////
  async updateProductt(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }
  async updateProduct(
    updateProductInput: UpdateProductInput,
    user: User,
  ): Promise<Product> {
    const product = await this.getProductUserById(updateProductInput.id, user);
    const { title, description, status, price, imageUrl, nbrLike } =
      updateProductInput;
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

    if (imageUrl) {
      product.imageUrl = imageUrl;
    }
    if (nbrLike) {
      product.nbrLike = nbrLike;
    }
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async deleteProductAdmin(id: string, user: User): Promise<Product> {
    try {
      const productFound: Product = await this.getProductById(id);

      const removedProductId = productFound.id;

      if (user.roles === 'admin' || 'subadmin') {
        const result: Product =
          await this.productRepository.remove(productFound);

        if (!result) {
          throw new NotFoundException(`Product with id ${id} not found`);
        }
        result.id = removedProductId;
        return result;
      } else {
        throw new UnauthorizedException(
          'You are not authorized to delete this product',
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the product.',
      );
    }
  }
}
