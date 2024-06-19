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
  private auctionAddress: string;
  private abi: any;
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
      'https://sepolia.infura.io/v3/65865959f822477dbb336a8a1dcbabc7',
    );

    this.auctionAddress = '0x269144a92442b4e4Cf0Ec70229e8c6FC7d4E8eed';
    const signer = new ethers.Wallet(
      'b1c06abe8c2dc4a273a88c95a90808cd3370d42ee43ac8c4a4f3c9cfc879505f',
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
          {
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'winner',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'AuctionEnded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'bidder',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'NewBid',
        type: 'event',
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
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'bids',
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
        name: 'endAuction',
        outputs: [],
        stateMutability: 'payable',
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
        name: 'getBidders',
        outputs: [
          {
            internalType: 'address[]',
            name: '',
            type: 'address[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getBounce',
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
        name: 'getLast',
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
        name: 'getLastBidder',
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
        name: 'getOwner',
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
        name: 'last',
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
        name: 'lastBidder',
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
    ];
    this.contract = new ethers.Contract(this.auctionAddress, abi, signer);
  }
  async findBySpecialProductId(
    specialProductId: string,
  ): Promise<SpecialProductPrice[]> {
    return this.specialProductPriceRepository.find({
      relations: ['user'],
      where: { specialProduct: { id: specialProductId } },
    });
  }
  async getOwnerByProductId(productId: string): Promise<string> {
    try {
      const specialProduct = await this.specialProductRepository.findOne({
        where: { id: productId },
        relations: ['user'],
      });

      const owner = specialProduct.user.address;
      console.log(owner);

      return owner;
    } catch (error) {
      console.error('Error fetching owner by product ID:', error);
      throw new Error('Failed to fetch owner by product ID');
    }
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
        relations: ['user', 'specialProduct'],
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

    const enteredPrice = ethers.parseEther(
      createSpecialProductPriceInput.price,
    );
    console.log('enterprice', enteredPrice);
    const previousBids = await this.getHigherBids(
      specialProduct.id,
      // enteredPrice,
    );

    console.log('trying the bid from sol');
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
    return this.contract.getLastBidder();
  }
  async getOwner(): Promise<string> {
    return this.contract.getOwner();
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

  async findAll(): Promise<SpecialProductPrice[]> {
    return this.specialProductPriceRepository.find({
      relations: ['user', 'specialProduct'],
    });
  }

  async deleteAll(): Promise<void> {
    await this.specialProductPriceRepository.delete({});
  }
}
