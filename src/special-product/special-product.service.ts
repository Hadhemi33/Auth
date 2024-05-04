// special-product.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialProduct } from './entities/special-product.entity';
import { CreateSpecialProductInput } from './dto/create-special-product.input';
import { User } from 'src/user/entities/user.entity';
import { CategoryService } from 'src/category/category.service';

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
}
