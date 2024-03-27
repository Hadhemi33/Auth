import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async createCategory(
    createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    const { name } = createCategoryInput;
    const newCategory = this.categoryRepository.create({
      name,
    });
    return this.categoryRepository.save(newCategory);
  }
  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
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
}
