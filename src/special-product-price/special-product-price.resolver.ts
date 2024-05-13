import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SpecialProductPriceService } from './special-product-price.service';
import { SpecialProductPrice } from './entities/special-product-price.entity';
import { CreateSpecialProductPriceInput } from './dto/create-special-product-price.input';
import { UpdateSpecialProductPriceInput } from './dto/update-special-product-price.input';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/get-current-user.decorator';
@Resolver(() => SpecialProductPrice)
export class SpecialProductPriceResolver {
  constructor(
    private readonly specialProductPriceService: SpecialProductPriceService,
  ) {}
  @Mutation(() => SpecialProductPrice)
  @UseGuards(JwtAuthGuard)
  async createSpecialProductPrice(
    @Args('createSpecialProductPriceInput')
    createSpecialProductPriceInput: CreateSpecialProductPriceInput,
    @CurrentUser() user: User,
  ) {
    return this.specialProductPriceService.create(
      createSpecialProductPriceInput,
      user,
    );
  }
  @Mutation(() => SpecialProductPrice)
  async updateSpecialProductPrice(
    @Args('updateSpecialProductPriceInput')
    updateSpecialProductPriceInput: UpdateSpecialProductPriceInput,
  ) {
    return this.specialProductPriceService.update(
      updateSpecialProductPriceInput,
    );
  }
  @Query(() => [SpecialProductPrice])
  async specialProductPrices(
    @Args('specialProductId') specialProductId: string,
  ) {
    return this.specialProductPriceService.findBySpecialProductId(
      specialProductId,
    );
  }
  @Query(() => [SpecialProductPrice])
  async AllspecialProductPrices() {
    return this.specialProductPriceService.findAll();
  }
  @Mutation(() => String)
  async deleteAllSpecialProductPrices(): Promise<string> {
    await this.specialProductPriceService.deleteAll();
    return 'All special product prices deleted successfully';
  }
}
