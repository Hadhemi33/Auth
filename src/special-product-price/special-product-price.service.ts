import { Injectable } from '@nestjs/common';
import { CreateSpecialProductPriceInput } from './dto/create-special-product-price.input';
import { UpdateSpecialProductPriceInput } from './dto/update-special-product-price.input';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialProductPrice } from './entities/special-product-price.entity';
import { MoreThan, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { UserService } from 'src/user/user.service';
import { spec } from 'node:test/reporters';

@Injectable()
export class SpecialProductPriceService {
  constructor(
    @InjectRepository(SpecialProductPrice)
    private readonly specialProductPriceRepository: Repository<SpecialProductPrice>,
    private readonly specialProductService: SpecialProductService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SpecialProduct)
    private specialProductRepository: Repository<SpecialProduct>,
    private readonly userService: UserService,
  ) {}
  async getHigherBids(
    specialProductId: string,
    currentPrice: number,
  ): Promise<SpecialProductPrice[]> {
    return this.specialProductPriceRepository.find({
      where: {
        specialProduct: { id: specialProductId },
        price: MoreThan(currentPrice.toString()),
      },
      relations: ['user'],
    });
  }
  async getBidsToNotify(): Promise<any[]> {
    const bids = await this.specialProductPriceRepository.find({
      where: {
        notified: false,
      },
      relations: ['user', 'specialProduct'],
    });

    const bidsToNotify = [];

    for (const bid of bids) {
      const higherBids = await this.getHigherBids(
        bid.specialProduct.id,
        parseFloat(bid.price),
      );
      if (higherBids.length > 0) {
        bidsToNotify.push({
          id: bid.id,
          userId: bid.user.id,
          productTitle: bid.specialProduct.title,
          newPrice: higherBids[0].price,
        });
      }
    }

    return bidsToNotify;
  }

  async markBidAsNotified(bidId: string): Promise<void> {
    await this.specialProductPriceRepository.update(bidId, { notified: true });
  }
  // async create(
  //   createSpecialProductPriceInput: CreateSpecialProductPriceInput,
  //   user: User,
  // ): Promise<SpecialProductPrice> {
  //   const specialProduct = await this.specialProductRepository.findOne({
  //     where: { id: createSpecialProductPriceInput.specialProductId },
  //   });

  //   const price = parseFloat(specialProduct.price);
  //   const discount = parseFloat(specialProduct.discount);

  //   let minimumPrice = price;
  //   if (!isNaN(discount)) {
  //     minimumPrice -= (discount / 100) * price;
  //   }
  //   const enteredPrice = parseFloat(createSpecialProductPriceInput.price);
  //   if (enteredPrice < minimumPrice) {
  //     throw new Error(
  //       `Sorry, you cannot buy this product at a price lower than ${minimumPrice}`,
  //     );
  //   }

  //   const previousBids = await this.getHigherBids(
  //     specialProduct.id,
  //     enteredPrice,
  //   );
  //   const specialProductPrice = this.specialProductPriceRepository.create({
  //     ...createSpecialProductPriceInput,
  //     price: createSpecialProductPriceInput.price,
  //     user: user,
  //   });
  //   const { specialProductId } = createSpecialProductPriceInput;
  //   await this.specialProductService.updateSpecialProduct(
  //     {
  //       id: specialProductId,
  //       price: createSpecialProductPriceInput.price,
  //     },
  //     user,
  //   );
  //   const savedSpecialProductPrice =
  //     await this.specialProductPriceRepository.save(specialProductPrice);

  //   for (const bid of previousBids) {
  //     await this.userService.sendNotification(
  //       bid.user.id,
  //       `A higher bid of ${enteredPrice} has been placed for the product ${specialProduct.title}`,
  //     );
  //   }

  //   console.log(
  //     'specialProductId:',
  //     createSpecialProductPriceInput.specialProductId,
  //   );

  //   await this.userRepository
  //     .createQueryBuilder()
  //     .relation(User, 'specialProductPrices')
  //     .of(user)
  //     .add(savedSpecialProductPrice);

  //   await this.specialProductRepository
  //     .createQueryBuilder()
  //     .relation(SpecialProduct, 'prices')
  //     .of(specialProduct)
  //     .add(savedSpecialProductPrice);

  //   return savedSpecialProductPrice;
  // }

  async create(
    createSpecialProductPriceInput: CreateSpecialProductPriceInput,
    user: User,
  ): Promise<SpecialProductPrice> {
    const specialProduct = await this.specialProductRepository.findOne({
      where: { id: createSpecialProductPriceInput.specialProductId },
    });

    if (!specialProduct) {
      throw new Error('Special not found.');
    }

    const userOwnsProduct = user.specialProducts.some(
      (product) => product.id === specialProduct.id,
    );

    if (userOwnsProduct) {
      throw new Error('Sorry, you cannot buy yours !!');
    }

    const price = parseFloat(specialProduct.price);
    const discount = parseFloat(specialProduct.discount);

    let minimumPrice = price;
    if (!isNaN(discount)) {
      minimumPrice -= (discount / 100) * price;
    }

    const enteredPrice = parseFloat(createSpecialProductPriceInput.price);
    if (enteredPrice < minimumPrice) {
      throw new Error(
        `Sorry, you cannot buy this product at a price lower than ${minimumPrice}`,
      );
    }

    const previousBids = await this.getHigherBids(
      specialProduct.id,
      enteredPrice,
    );

    const specialProductPrice = this.specialProductPriceRepository.create({
      ...createSpecialProductPriceInput,
      price: createSpecialProductPriceInput.price,
      user: user,
    });

    await this.specialProductService.updateSpecialProduct(
      {
        id: specialProduct.id,
        price: createSpecialProductPriceInput.price,
      },
      user,
    );

    const savedSpecialProductPrice =
      await this.specialProductPriceRepository.save(specialProductPrice);

    for (const bid of previousBids) {
      await this.userService.sendNotification(
        bid.user.id,
        `A higher bidd of ${enteredPrice} has been placed for the product ${specialProduct.title}`,
      );
    }

    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'specialProductPrices')
      .of(user)
      .add(savedSpecialProductPrice);

    await this.specialProductRepository
      .createQueryBuilder()
      .relation(SpecialProduct, 'prices')
      .of(specialProduct)
      .add(savedSpecialProductPrice);

    return savedSpecialProductPrice;
  }
  // async update(
  //   updateSpecialProductPriceInput: UpdateSpecialProductPriceInput,
  // ): Promise<SpecialProductPrice> {
  //   const { id, ...rest } = updateSpecialProductPriceInput;
  //   await this.specialProductPriceRepository.update(id, rest);
  //   return this.specialProductPriceRepository.findOne({ where: { id } });
  // }

  // async findBySpecialProductId(
  //   specialProductId: string,
  // ): Promise<SpecialProductPrice[]> {
  //   return this.specialProductPriceRepository.find({
  //     where: { id: specialProductId },
  //   });
  // }
  async update(
    updateSpecialProductPriceInput: UpdateSpecialProductPriceInput,
  ): Promise<SpecialProductPrice> {
    const { id, ...rest } = updateSpecialProductPriceInput;
    await this.specialProductPriceRepository.update(id, rest);
    return this.specialProductPriceRepository.findOne({ where: { id } });
  }

  async findBySpecialProductId(
    specialProductId: string,
  ): Promise<SpecialProductPrice[]> {
    return this.specialProductPriceRepository.find({
      where: { specialProduct: { id: specialProductId } },
    });
  }
  async findAll(): Promise<SpecialProductPrice[]> {
    return this.specialProductPriceRepository.find({
      relations: ['user', 'specialProduct'],
    });
  }
  async deleteAll(): Promise<void> {
    await this.specialProductPriceRepository.delete({});
  }
}