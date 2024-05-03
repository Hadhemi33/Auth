import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UserService } from 'src/user/user.service';
import { NotFoundException, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/get-current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Category)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @SetMetadata('roles', ['user'])
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
    @Args('id') id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryInput);
  }

  @Mutation(() => Boolean)
  async deleteAllCategories(): Promise<boolean> {
    try {
      await this.categoryService.deleteAllCategories();
      return true;
    } catch (error) {
      console.error('Error deleting all categories:', error);
      throw error;
    }
  }
  // @Mutation(() => Boolean)
  // async deleteCategory(
  //   @Args('name', { type: () => String }) name: string,
  // ): Promise<boolean> {
  //   try {
  //     await this.categoryService.deleteCategory(name);
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting category:', error);
  //     throw error;
  //   }
  // }
  @Mutation(() => String) // Indique que la mutation renverra un message de confirmation
  async deleteCategory(@Args('name') name: string): Promise<string> {
    const category = await this.categoryService.getCategoryByName(name);

    if (!category) {
      throw new NotFoundException(`Category with name "${name}" not found.`);
    }

    await this.categoryService.deleteCategory(name);
    return `Category with name "${name}" was successfully deleted.`; // Retourner un message de confirmation
  }
}
