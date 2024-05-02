import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from 'src/auth/get-current-user.decorator';

import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private usersService: UserService) {}
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.updateUserProfile(updateUserInput);
  }
  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }
  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Query(() => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Query(() => User)
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    return this.usersService.getUserByEmail(email);
  }

  @Query(() => User)
  async getUserByFullName(@Args('fullName') fullName: string): Promise<User> {
    return this.usersService.getUserByFullName(fullName);
  }

  @Query(() => User)
  async getUserByPhoneNumber(
    @Args('phoneNumber') phoneNumber: string,
  ): Promise<User> {
    return this.usersService.getUserByPhoneNumber(phoneNumber);
  }
  @ResolveField(() => [Product], { nullable: true })
  async products(@Parent() user: User): Promise<Product[]> {
    if (!user || !user.products) {
      return []; // Return an empty array if user or products are null
    }

    return user.products;
  }
  @ResolveField(() => [Category], { nullable: true })
  async categories(@Parent() user: User): Promise<Category[]> {
    if (!user || !user.categories) {
      return [];
    }

    return user.categories;
  }
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    try {
      await this.usersService.deleteUser(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
