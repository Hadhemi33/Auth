import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UserService } from 'src/user/user.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,

    @Args('username') username: string,
  ): Promise<Category> {
    const user = await this.userService.getUser(username);

    if (!user) {
      throw new NotFoundException(`User with email  ${username} not found`);
    }

    const newCategory = await this.categoryService.createCategory(
      createCategoryInput,
      user,
    );
    if (newCategory) {
      throw new NotFoundException('Category already created');
    }
    return newCategory;
  }
  @Query(() => Category)
  async getCategoryById(@Args('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
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
}
