import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  // async onModuleInit() {
  //   // Ensure default category exists
  //   const existingCategory = await this.categoryRepository.findOne({
  //     where: { name: 'Uncategorized' },
  //   });

  //   if (!existingCategory) {
  //     const defaultCategory = new Category();
  //     defaultCategory.name = 'Uncategorized';
  //     await this.categoryRepository.save(defaultCategory);
  //   }
  // }
  async createCategory(
    createCategoryInput: CreateCategoryInput,
    user: User,
  ): Promise<Category> {
    const { name } = createCategoryInput;

    const newCategory = this.categoryRepository.create({
      ...createCategoryInput,
      user,
    });

    try {
      await this.categoryRepository.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
  async getCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { name },
      relations: ['user', 'products'],
    });
    if (!category) {
      throw new NotFoundException(`Category with Name ${name} not found`);
    }
    return category;
  }
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['user', 'products'] });
  }
  async updateCategory(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const { name } = updateCategoryInput;
    const category = await this.getCategoryById(id);

    if (name) {
      category.name = name;
    }

    return this.categoryRepository.save(category);
  }
  async deleteAllCategories(): Promise<void> {
    await this.categoryRepository.clear(); // This clears all records in the Category table
  }
  // async deleteCategory(name: string): Promise<void> {
  //   try {
  //     const category = await this.categoryRepository.findOne({
  //       where: { name },
  //       relations: ['user'],
  //     });

  //     if (!category) {
  //       throw new NotFoundException(`Category with name "${name}" not found.`);
  //     }

  //     console.log('Deleting category:', category); // Add debug logging
  //     await this.categoryRepository.remove(category);
  //   } catch (error) {
  //     console.error('Error in deleteCategory:', error); // Add error logging
  //     throw error; // Rethrow the error
  //   }
  // }
  async deleteCategory(name: string): Promise<void> {
    // Rechercher la catégorie à supprimer
    const category = await this.categoryRepository.findOne({
      where: { name },
      relations: ['products', 'user'], // Assurez-vous de charger les relations pertinentes
    });

    if (!category) {
      throw new NotFoundException(`Category with name "${name}" not found.`);
    }

    const defaultCategory = await this.categoryRepository.findOne({
      where: { name: 'Uncategorized' },
    });

    if (!defaultCategory) {
      throw new InternalServerErrorException('Default category not found');
    }

    if (category.products && category.products.length > 0) {
      for (const product of category.products) {
        product.category = defaultCategory;
        await this.categoryRepository.save(product);
      }
    }

    await this.categoryRepository.remove(category);
  }
}
