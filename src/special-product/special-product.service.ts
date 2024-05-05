// special-product.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { SpecialProduct } from './entities/special-product.entity';
import { CreateSpecialProductInput } from './dto/create-special-product.input';
import { User } from 'src/user/entities/user.entity';
import { CategoryService } from 'src/category/category.service';
import { UpdateSpecialProductInput } from './dto/update-special-product.input';

@Injectable()
export class SpecialProductService {
  constructor(
    @InjectRepository(SpecialProduct)
    private specialProductRepository: Repository<SpecialProduct>,
    private categoryService: CategoryService,
  ) {}

  async createSpecialProduct(
    createSpecialProductInput: CreateSpecialProductInput,
    user: User,
  ): Promise<SpecialProduct> {
    try {
      const category = await this.categoryService.getCategoryById(
        createSpecialProductInput.categoryId,
      );
      if (!category) {
        throw new Error(
          `Category with ID ${createSpecialProductInput.categoryId} does not exist.`,
        );
      }
      const specialProduct = this.specialProductRepository.create(
        createSpecialProductInput,
      );
      specialProduct.user = user;
      specialProduct.category = category;
      const savedSpecialProduct =
        await this.specialProductRepository.save(specialProduct);
      return savedSpecialProduct;
    } catch (error) {
      console.error('Error during product creation:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the product.',
      );
    }
  }
  async getAllSpecialProducts(
    userId?: string,
    categoryId?: string,
    title?: string,
    price?: string,
  ): Promise<SpecialProduct[]> {
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
      const specialProducts = await this.specialProductRepository.find({
        where: query,
        relations: ['user', 'category'],
      });

      if (specialProducts.length === 0) {
        throw new NotFoundException('No special products found');
      }

      return specialProducts;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching special products');
    }
  }
  async getProductUserById(id: string, user: User): Promise<SpecialProduct> {
    const specialProductFound = await this.specialProductRepository.findOne({
      where: { id, user },
      relations: ['user', 'category'],
    });

    if (!specialProductFound) {
      throw new NotFoundException(`Special Product with id ${id} not found`);
    }
    return specialProductFound;
  }

  async updateSpecialProductt(
    specialProduct: SpecialProduct,
  ): Promise<SpecialProduct> {
    return this.specialProductRepository.save(specialProduct); // Update the product in the database
  }
  async updateSpecialProduct(
    updateSpecialProductInput: UpdateSpecialProductInput,
    user: User,
  ): Promise<SpecialProduct> {
    const product = await this.getProductUserById(
      updateSpecialProductInput.id,
      user,
    );
    const { title, description, price, imageUrl } = updateSpecialProductInput;
    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }

    if (imageUrl) {
      product.imageUrl = imageUrl;
    }
    try {
      await this.specialProductRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
