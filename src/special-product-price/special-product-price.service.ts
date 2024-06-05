// import { Injectable } from '@nestjs/common';
// import { CreateSpecialProductPriceInput } from './dto/create-special-product-price.input';
// import { UpdateSpecialProductPriceInput } from './dto/update-special-product-price.input';
// import { InjectRepository } from '@nestjs/typeorm';
// import { SpecialProductPrice } from './entities/special-product-price.entity';
// import { Repository } from 'typeorm';
// import { User } from 'src/user/entities/user.entity';
// import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
// import { SpecialProductService } from 'src/special-product/special-product.service';
// import { UserService } from 'src/user/user.service';
// import { ethers } from 'ethers';
// // import AuctionABI from '../../artifacts/contracts/Auction.sol/';
// @Injectable()
// export class SpecialProductPriceService {
//   private provider: ethers.JsonRpcProvider;
//   private contract: ethers.Contract;
//   private auctionAddress: string;
//   private abi: any;
//   constructor(
//     @InjectRepository(SpecialProductPrice)
//     private specialProductPriceRepository: Repository<SpecialProductPrice>,
//     private specialProductService: SpecialProductService,
//     @InjectRepository(User) private userRepository: Repository<User>,
//     @InjectRepository(SpecialProduct)
//     private specialProductRepository: Repository<SpecialProduct>,
//     private userService: UserService,
//   ) {
//     // Initialize ethers provider and contract
//     this.provider = new ethers.JsonRpcProvider(
//       'https://sepolia.infura.io/v3/65865959f822477dbb336a8a1dcbabc7',
//     );
//     const auctionAddress = '0x2859c77d19b39e2ee1f8739E28f398f8945A8daC';
//     const signer = new ethers.Wallet(
//       '36ac4fc0106f2781a981910e6576a62bab834480c2aba231758128ed400decbc',
//       this.provider,
//     );
//     const senderPrivateKey =
//       '36ac4fc0106f2781a981910e6576a62bab834480c2aba231758128ed400decbc';
//     const senderWallet = new ethers.Wallet(senderPrivateKey, this.provider);
//     const abi = [
//       {
//         inputs: [
//           {
//             internalType: 'uint256',
//             name: '_biddingTime',
//             type: 'uint256',
//           },
//           {
//             internalType: 'address',
//             name: '_owner',
//             type: 'address',
//           },
//         ],
//         stateMutability: 'nonpayable',
//         type: 'constructor',
//       },
//       {
//         anonymous: false,
//         inputs: [
//           {
//             indexed: false,
//             internalType: 'address',
//             name: 'winner',
//             type: 'address',
//           },
//           {
//             indexed: false,
//             internalType: 'uint256',
//             name: 'amount',
//             type: 'uint256',
//           },
//         ],
//         name: 'AuctionEnded',
//         type: 'event',
//       },
//       {
//         anonymous: false,
//         inputs: [
//           {
//             indexed: true,
//             internalType: 'address',
//             name: 'bidder',
//             type: 'address',
//           },
//           {
//             indexed: false,
//             internalType: 'uint256',
//             name: 'amount',
//             type: 'uint256',
//           },
//         ],
//         name: 'NewBid',
//         type: 'event',
//       },
//       {
//         inputs: [
//           {
//             internalType: 'uint256',
//             name: 'amount',
//             type: 'uint256',
//           },
//         ],
//         name: 'bid',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [
//           {
//             internalType: 'uint256',
//             name: '',
//             type: 'uint256',
//           },
//         ],
//         name: 'bidders',
//         outputs: [
//           {
//             internalType: 'address',
//             name: '',
//             type: 'address',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [
//           {
//             internalType: 'address',
//             name: '',
//             type: 'address',
//           },
//         ],
//         name: 'bids',
//         outputs: [
//           {
//             internalType: 'uint256',
//             name: '',
//             type: 'uint256',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'endAuction',
//         outputs: [],
//         stateMutability: 'nonpayable',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'endTime',
//         outputs: [
//           {
//             internalType: 'uint256',
//             name: '',
//             type: 'uint256',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'ended',
//         outputs: [
//           {
//             internalType: 'bool',
//             name: '',
//             type: 'bool',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'getBidders',
//         outputs: [
//           {
//             internalType: 'address[]',
//             name: '',
//             type: 'address[]',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'getLastBidder',
//         outputs: [
//           {
//             internalType: 'address',
//             name: '',
//             type: 'address',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'getOwner',
//         outputs: [
//           {
//             internalType: 'address',
//             name: '',
//             type: 'address',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'lastBidder',
//         outputs: [
//           {
//             internalType: 'address',
//             name: '',
//             type: 'address',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//       {
//         inputs: [],
//         name: 'owner',
//         outputs: [
//           {
//             internalType: 'address',
//             name: '',
//             type: 'address',
//           },
//         ],
//         stateMutability: 'view',
//         type: 'function',
//       },
//     ];
//     this.contract = new ethers.Contract(auctionAddress, abi, signer);
//   }
//   async findBySpecialProductId(
//     specialProductId: string,
//   ): Promise<SpecialProductPrice[]> {
//     return this.specialProductPriceRepository.find({
//       relations: ['user'],
//       where: { specialProduct: { id: specialProductId } },
//     });
//   }
//   async getOwnerByProductId(productId: string): Promise<string> {
//     try {
//       const specialProduct = await this.specialProductRepository.findOne({
//         where: { id: productId },
//         relations: ['user'],
//       });

//       const owner = specialProduct.user.address;
//       console.log(owner);

//       return owner;
//     } catch (error) {
//       console.error('Error fetching owner by product ID:', error);
//       throw new Error('Failed to fetch owner by product ID');
//     }
//   }

//   async getHigherBids(
//     specialProductId: string,
//     // currentPrice: number,
//   ): Promise<SpecialProductPrice[]> {
//     try {
//       const higherBids = await this.specialProductPriceRepository.find({
//         where: {
//           specialProduct: { id: specialProductId },
//           // price: currentPrice.toString(),
//         },
//         relations: ['user', 'specialProduct'],
//       });

//       console.log('Higher Bids:', higherBids);
//       return higherBids;
//     } catch (error) {
//       console.error('Error fetching higher bids:', error);
//       throw error;
//     }
//   }

//   async placeBid(
//     createSpecialProductPriceInput: CreateSpecialProductPriceInput,
//     user: User,
//   ): Promise<SpecialProductPrice> {
//     const specialProduct = await this.specialProductRepository.findOne({
//       where: { id: createSpecialProductPriceInput.specialProductId },
//     });

//     if (!specialProduct) {
//       throw new Error('Special not found.');
//     }

//     const userOwnsProduct = user.specialProducts.some(
//       (product) => product.id === specialProduct.id,
//     );

//     if (userOwnsProduct) {
//       throw new Error('Sorry, you cannot buy yours !!');
//     }

//     if (specialProduct.notified === true) {
//       throw new Error(
//         'Sorry, you cannot buy this product because it was expired !!',
//       );
//     }
//     // const price = parseFloat(specialProduct.price);
//     const enteredPrice = ethers.parseEther(specialProduct.price);
//     // const discount = parseFloat(specialProduct.discount);
//     // const owner = specialProduct.user;

//     // let minimumPrice = price;
//     // if (!isNaN(discount)) {
//     //   minimumPrice -= (discount / 100) * price;
//     // }
//     // const enteredPrice = parseFloat(createSpecialProductPriceInput.price);

//     const previousBids = await this.getHigherBids(
//       specialProduct.id,
//       // enteredPrice,
//     );
//     // Check the balance of the bidder

//     // Place bid on the smart contract
//     const tx = await this.contract.bid({ value: enteredPrice });
//     await tx.wait();
//     const specialProductPrice = this.specialProductPriceRepository.create({
//       ...createSpecialProductPriceInput,
//       price: createSpecialProductPriceInput.price,
//       user: user,
//     });

//     await this.specialProductService.updateSpecialProduct(
//       {
//         id: specialProduct.id,
//         price: createSpecialProductPriceInput.price,
//       },
//       user,
//     );

//     const savedSpecialProductPrice =
//       await this.specialProductPriceRepository.save(specialProductPrice);
//     const notifiedUsers = new Set<number>();

//     for (const bid of previousBids) {
//       if (!notifiedUsers.has(parseInt(bid.user.id))) {
//         await this.userService.sendNotification(
//           bid.user.id,
//           `A higher bid of ${enteredPrice} has been placed for the product ${specialProduct.title}`,
//         );
//         notifiedUsers.add(parseInt(bid.user.id));
//       }
//     }

//     await this.userRepository
//       .createQueryBuilder()
//       .relation(User, 'specialProductPrices')
//       .of(user)
//       .add(savedSpecialProductPrice);

//     await this.specialProductRepository
//       .createQueryBuilder()
//       .relation(SpecialProduct, 'prices')
//       .of(specialProduct)
//       .add(savedSpecialProductPrice);

//     return savedSpecialProductPrice;
//   }
//   async endAuction(): Promise<void> {
//     const tx = await this.contract.endAuction();
//     await tx.wait();
//   }

//   async getWinner(): Promise<string> {
//     return this.contract.getLastBidder();
//   }
//   async getOwner(): Promise<string> {
//     return this.contract.getOwner();
//   }

//   async getLastBidBySpecialProductId(
//     specialProductId: string,
//   ): Promise<SpecialProductPrice | null> {
//     return this.specialProductPriceRepository.findOne({
//       where: { specialProduct: { id: specialProductId } },
//       // order: { createdAt: 'DESC' },
//       relations: ['user'],
//     });
//   }
//   async update(
//     updateSpecialProductPriceInput: UpdateSpecialProductPriceInput,
//   ): Promise<SpecialProductPrice> {
//     const { id, ...rest } = updateSpecialProductPriceInput;
//     await this.specialProductPriceRepository.update(id, rest);
//     return this.specialProductPriceRepository.findOne({ where: { id } });
//   }

//   async findAll(): Promise<SpecialProductPrice[]> {
//     return this.specialProductPriceRepository.find({
//       relations: ['user', 'specialProduct'],
//     });
//   }
//   async deleteAll(): Promise<void> {
//     await this.specialProductPriceRepository.delete({});
//   }
// }
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
    this.auctionAddress = '0x916178EAD765bcdF45e0CfAEd58FbbEB05a92680';
    const signer = new ethers.Wallet(
      '36ac4fc0106f2781a981910e6576a62bab834480c2aba231758128ed400decbc',
      this.provider,
    );

    this.abi = [
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
        inputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'bid',
        outputs: [],
        stateMutability: 'nonpayable',
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
    this.contract = new ethers.Contract(this.auctionAddress, this.abi, signer);
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
  ): Promise<SpecialProductPrice[]> {
    try {
      const higherBids = await this.specialProductPriceRepository.find({
        where: { specialProduct: { id: specialProductId } },
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
      throw new Error('Special product not found.');
    }

    const userOwnsProduct = user.specialProducts.some(
      (product) => product.id === specialProduct.id,
    );

    if (userOwnsProduct) {
      throw new Error('Sorry, you cannot buy your own product.');
    }

    if (specialProduct.notified === true) {
      throw new Error('Sorry, this product has expired.');
    }

    const enteredPrice = ethers.parseEther(specialProduct.price); // Convert the price to wei

    // Check the balance of the bidder (optional)
    // const balance = await this.provider.getBalance(user.address);
    // if (balance.lt(enteredPrice)) {
    //   throw new Error('Insufficient balance.');
    // }

    // Place bid on the smart contract
    const tx = await this.contract.bid(enteredPrice, { value: enteredPrice });
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

    const previousBids = await this.getHigherBids(specialProduct.id);
    const notifiedUsers = new Set<number>();

    for (const bid of previousBids) {
      if (!notifiedUsers.has(parseInt(bid.user.id))) {
        await this.userService.sendNotification(
          bid.user.id,
          `A higher bid of ${createSpecialProductPriceInput.price} has been placed for the product ${specialProduct.title}`,
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
