import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SpecialProductPriceService } from './special-product-price.service';
import { SpecialProductPrice } from './entities/special-product-price.entity';
import { CreateSpecialProductPriceInput } from './dto/create-special-product-price.input';
import { UpdateSpecialProductPriceInput } from './dto/update-special-product-price.input';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/get-current-user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { Repository } from 'typeorm';
@Resolver(() => SpecialProductPrice)
export class SpecialProductPriceResolver {
  constructor(
    private readonly specialProductPriceService: SpecialProductPriceService,
    @InjectRepository(SpecialProduct)
    private specialProductRepository: Repository<SpecialProduct>,
  ) {}
  @Mutation(() => SpecialProductPrice)
  @UseGuards(JwtAuthGuard)
  async createSpecialProductPrice(
    @Args('createSpecialProductPriceInput')
    createSpecialProductPriceInput: CreateSpecialProductPriceInput,
    @CurrentUser() user: User,
  ): Promise<SpecialProductPrice | Error> {
    const specialProduct = await this.specialProductRepository.findOne({
      where: { id: createSpecialProductPriceInput.specialProductId },
    });

    const enteredPrice = parseFloat(createSpecialProductPriceInput.price);
    const actualPrice = parseFloat(specialProduct.price);
    const discountPrice =
      actualPrice - (parseFloat(specialProduct.discount) / 100) * actualPrice;

    const futurPrice =
      actualPrice + (parseFloat(specialProduct.discount) / 100) * actualPrice;

    if (enteredPrice < discountPrice) {
      return new Error(
        `Sorry, you cannot buy this product at a price lower than ${discountPrice}`,
      );
    }
    if (enteredPrice <= futurPrice) {
      return new Error(
        `Sorry, you cannot buy this product at a price lower than ${futurPrice}`,
      );
    }
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
