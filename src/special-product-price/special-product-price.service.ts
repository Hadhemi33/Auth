import { Injectable } from '@nestjs/common';
import { CreateSpecialProductPriceInput } from './dto/create-special-product-price.input';
import { UpdateSpecialProductPriceInput } from './dto/update-special-product-price.input';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialProductPrice } from './entities/special-product-price.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { UserService } from 'src/user/user.service';
import { spec } from 'node:test/reporters';

@Injectable()
export class SpecialProductPriceService {
  constructor(
    @InjectRepository(SpecialProductPrice)
    private  specialProductPriceRepository: Repository<SpecialProductPrice>,
    private  specialProductService: SpecialProductService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SpecialProduct)
    private specialProductRepository: Repository<SpecialProduct>,
    private  userService: UserService,
  ) {}

  async getHigherBids(
    specialProductId: string,
    // currentPrice: number,
  ): Promise<SpecialProductPrice[]> {
    try {
      const higherBids = await this.specialProductPriceRepository.find({
        where: {
          specialProduct: { id: specialProductId },
          // price: currentPrice.toString(),
        },
        relations: ['user'],
      });

      console.log('Higher Bids:', higherBids);
      return higherBids;
    } catch (error) {
      console.error('Error fetching higher bids:', error);
      throw error;
    }
  }

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

    const previousBids = await this.getHigherBids(
      specialProduct.id,
      // enteredPrice,
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
    const notifiedUsers = new Set<number>();

    for (const bid of previousBids) {
      if (!notifiedUsers.has(parseInt(bid.user.id))) {
        await this.userService.sendNotification(
          bid.user.id,
          `A higher bid of ${enteredPrice} has been placed for the product ${specialProduct.title}`,
        );
        notifiedUsers.add(parseInt(bid.user.id));
      }
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
