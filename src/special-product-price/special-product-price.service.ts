import { Injectable } from '@nestjs/common';
import { CreateSpecialProductPriceInput } from './dto/create-special-product-price.input';
import { UpdateSpecialProductPriceInput } from './dto/update-special-product-price.input';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialProductPrice } from './entities/special-product-price.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { UserService } from 'src/user/user.service';
import { ethers } from 'ethers';
// import AuctionABI from '../../artifacts/contracts/Auction.sol/';
@Injectable()
export class SpecialProductPriceService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  constructor(
    @InjectRepository(SpecialProductPrice)
    private specialProductPriceRepository: Repository<SpecialProductPrice>,
    private specialProductService: SpecialProductService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SpecialProduct)
    private specialProductRepository: Repository<SpecialProduct>,
    private userService: UserService,
  ) {
    // Initialize ethers provider and contract
    this.provider = new ethers.JsonRpcProvider(
      'https://sepolia.infura.io/v3/cf8c01ab331948e4b5df67110ae6d7a1',
    );
    const auctionAddress = '0x682E42bf7A6436DF33a5e2B0f93e9A31e81183A7';
    const signer = new ethers.Wallet(
      'dfe47c099fffd0458fc770a60b54da8ae9bdeff3832995db87822171dbd9f973',
      this.provider,
    );
    const abi = [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_biddingTime',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'bid',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'bidders',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'endAuction',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'endTime',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'ended',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getWinner',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'highestBid',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'winner',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];
    this.contract = new ethers.Contract(auctionAddress, abi, signer);
  }

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

  async placeBid(
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

    if (specialProduct.notified === true) {
      throw new Error(
        'Sorry, you cannot buy this product because it was expired !!',
      );
    }
    // const price = parseFloat(specialProduct.price);
    const enteredPrice = ethers.parseEther(specialProduct.price);
    const discount = parseFloat(specialProduct.discount);

    // let minimumPrice = price;
    // if (!isNaN(discount)) {
    //   minimumPrice -= (discount / 100) * price;
    // }
    // const enteredPrice = parseFloat(createSpecialProductPriceInput.price);

    const previousBids = await this.getHigherBids(
      specialProduct.id,
      // enteredPrice,
    );
    // Place bid on the smart contract
    const tx = await this.contract.bid({ value: enteredPrice });
    await tx.wait();
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
  async endAuction(): Promise<void> {
    const tx = await this.contract.endAuction();
    await tx.wait();
  }

  async getWinner(): Promise<string> {
    return this.contract.getWinner();
  }
  async getLastBidBySpecialProductId(
    specialProductId: string,
  ): Promise<SpecialProductPrice | null> {
    return this.specialProductPriceRepository.findOne({
      where: { specialProduct: { id: specialProductId } },
      // order: { createdAt: 'DESC' },
      relations: ['user'],
    });
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
