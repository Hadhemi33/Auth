import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UserService } from 'src/user/user.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/get-current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Category)
  // @UseGuards(JwtAuthGuard)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,

    @Args('id') id: string,
  ): Promise<Category> {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException(`User with email  ${id} not found`);
    }

    const newCategory = await this.categoryService.createCategory(
      createCategoryInput,
      user,
    );

    return newCategory;
  }
  @Query(() => Category)
  async getCategoryById(@Args('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }
  @Query(() => Category)
  async getCategoryByName(@Args('name') name: string): Promise<Category> {
    return this.categoryService.getCategoryByName(name);
  }
  @Query(() => [Category])
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }
  @Mutation(() => Category)
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryInput);
  }

  @Mutation(() => Boolean, {
    description: 'Delete all categories from the database',
  })
  async deleteAllCategories(): Promise<boolean> {
    try {
      await this.categoryService.deleteAllCategories();
      return true;
    } catch (error) {
      console.error('Error deleting all categories:', error);
      throw error;
    }
  }
  @Mutation(() => Boolean, {
    description: 'Delete a category by its name',
  })
  async deleteCategory(
    @Args('name', { type: () => String }) name: string,
  ): Promise<boolean> {
    try {
      await this.categoryService.deleteCategory(name); // Call the service method with the category name
      return true; // Indicate success
    } catch (error) {
      console.error('Error deleting category:', error); // Log error for debugging
      throw error; // Rethrow to propagate error to GraphQL layer
    }
  }
}
