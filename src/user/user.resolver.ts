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
import { SetMetadata, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private usersService: UserService) {}
  // @Mutation(returns => User)
  // async updateUser2(
  //   @Args('updateUserInput') updateUserInput: UpdateUserInput,
  // ): Promise<User> {
  //   return this.usersService.updateUser(updateUserInput.id, updateUserInput);
  // }

  @Mutation(() => Boolean)
  async requestPasswordReset(
    @Args('username') username: string,
  ): Promise<boolean> {
    return this.usersService.requestPasswordReset(username);
  }
  @Mutation(() => Boolean)
  async verifyResetCode(
    @Args('username') username: string,
    @Args('code') code: string,
  ): Promise<boolean> {
    return this.usersService.verifyResetCode(username, code);
  }
  @Mutation(() => Boolean)
  async resetPassword(
    @Args('username') username: string,
    @Args('code') code: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    return this.usersService.resetPassword(username, code, newPassword);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.updateUserProfile(updateUserInput, user);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
  async updateUserRole(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Args('id') id: string,
  ): Promise<User> {
    return this.usersService.updateUserRole(updateUserInput, id);
  }
  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }
  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async getAuthUser(@CurrentUser() user: User): Promise<User> {
    return this.usersService.getAuthUser(user);
  }
  @Query(() => [User])
  // @UseGuards(J wtAuthGuard)
  // @SetMetadata('roles', ['admin'])
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
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
