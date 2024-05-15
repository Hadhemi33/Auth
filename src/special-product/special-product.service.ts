// // special-product.service.ts
// import {
//   BadRequestException,
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Between, Like, Repository } from 'typeorm';
// import { SpecialProduct } from './entities/special-product.entity';
// import { CreateSpecialProductInput } from './dto/create-special-product.input';
// import { User } from 'src/user/entities/user.entity';
// import { CategoryService } from 'src/category/category.service';
// import { UpdateSpecialProductInput } from './dto/update-special-product.input';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class SpecialProductService {
//   constructor(
//     @InjectRepository(SpecialProduct)
//     private specialProductRepository: Repository<SpecialProduct>,
//     private categoryService: CategoryService,
//     private userService: UserService,
//   ) {}

//   async createSpecialProduct(
//     createSpecialProductInput: CreateSpecialProductInput,
//     user: User,
//   ): Promise<SpecialProduct> {
//     try {
//       const category = await this.categoryService.getCategoryById(
//         createSpecialProductInput.categoryId,
//       );
//       if (!category) {
//         throw new Error(
//           `Category with ID ${createSpecialProductInput.categoryId} does not exist.`,
//         );
//       }
//       const specialProduct = this.specialProductRepository.create(
//         createSpecialProductInput,
//       );
//       specialProduct.user = user;
//       specialProduct.category = category;
//       const savedSpecialProduct =
//         await this.specialProductRepository.save(specialProduct);
//       return savedSpecialProduct;
//     } catch (error) {
//       console.error('Error during product creation:', error);
//       throw new InternalServerErrorException(
//         'An error occurred while creating the product.',
//       );
//     }
//   }
//   async getSpecialProductById(id: string): Promise<SpecialProduct> {
//     const specialproduct = await this.specialProductRepository.findOne({
//       where: { id },
//     });
//     if (!specialproduct) {
//       throw new NotFoundException(`Special Product with ID ${id} not found`);
//     }
//     return specialproduct;
//   }
//   async getAllSpecialProducts(
//     userId?: string,
//     categoryId?: string,
//     title?: string,
//     price?: string,
//   ): Promise<SpecialProduct[]> {
//     const query: any = {};

//     if (userId) {
//       query.user = { id: userId };
//     }
//     if (categoryId) {
//       query.category = { id: categoryId };
//     }
//     if (title) {
//       query.title = title;
//     }
//     if (price) {
//       const numericPrice = parseFloat(price);
//       if (isNaN(numericPrice)) {
//         throw new Error('Price must be a valid number');
//       }

//       const lowerBound = Math.floor(numericPrice);
//       const upperBound = Math.ceil(numericPrice + 1) - 0.01;

//       if (numericPrice % 1 === 0) {
//         query.price = Between(lowerBound, upperBound);
//       } else {
//         query.price = Like(`${numericPrice}%`);
//       }
//     }
//     try {
//       const specialProducts = await this.specialProductRepository.find({
//         where: query,
//         relations: ['user', 'category'],
//       });

//       if (specialProducts.length === 0) {
//         throw new NotFoundException('No special products found');
//       }

//       return specialProducts;
//     } catch (error) {
//       throw new InternalServerErrorException('Error fetching special products');
//     }
//   }
//   async getSpecalProductUserById(
//     id: string,
//     user: User,
//   ): Promise<SpecialProduct> {
//     const specialProductFound = await this.specialProductRepository.findOne({
//       where: { id, user },
//       relations: ['user', 'category'],
//     });

//     if (!specialProductFound) {
//       throw new NotFoundException(`Special Product with id ${id} not found`);
//     }
//     return specialProductFound;
//   }

//   async updateSpecialProduct(
//     updateSpecialProductInput: UpdateSpecialProductInput,
//     user: User,
//   ): Promise<SpecialProduct> {
//     const product = await this.getSpecalProductUserById(
//       updateSpecialProductInput.id,
//       user,
//     );
//     const { title, description, price, imageUrl, discount } =
//       updateSpecialProductInput;
//     if (title) {
//       product.title = title;
//     }
//     if (description) {
//       product.description = description;
//     }
//     if (price) {
//       product.price = price;
//     }
//     if (discount) {
//       product.discount = discount;
//     }

//     if (imageUrl) {
//       product.imageUrl = imageUrl;
//     }

//     if (product.prices && product.prices.length > 0) {
//       product.discount = '0';

//       const lastBidPrice = product.prices[product.prices.length - 1]?.price;
//       if (lastBidPrice) {
//         product.price = lastBidPrice;
//       }
//     } else {

//       product.discount = discount;
//     }

//     try {
//       await this.specialProductRepository.save(product);
//       return product;
//     } catch (error) {
//       throw new InternalServerErrorException();
//     }
//   }

//   async deleteSpecialProduct(id: string, user: User): Promise<SpecialProduct> {
//     try {
//       const productFound: SpecialProduct = await this.getSpecalProductUserById(
//         id,
//         user,
//       );

//       const removedProductId = productFound.id;

//       if (user.roles === 'admin' || user.id === productFound.user.id) {
//         const result: SpecialProduct =
//           await this.specialProductRepository.remove(productFound);

//         if (!result) {
//           throw new NotFoundException(`Product with id ${id} not found`);
//         }

//         result.id = removedProductId;
//         return result;
//       } else {
//         throw new UnauthorizedException(
//           'You are not authorized to delete this product',
//         );
//       }
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       throw new InternalServerErrorException(
//         'An error occurred while deleting the product.',
//       );
//     }
//   }
//   async deleteSpecialProductAdmin(
//     id: string,
//     user: User,
//   ): Promise<SpecialProduct> {
//     try {

//       const productFound: SpecialProduct = await this.getSpecialProductById(id);

//       const removedProductId = productFound.id;

//       if (user.roles === 'admin') {
//         const result: SpecialProduct =
//           await this.specialProductRepository.remove(productFound);

//         if (!result) {
//           throw new NotFoundException(
//             `Special Product with id ${id} not found`,
//           );
//         }
//         result.id = removedProductId;
//         return result;
//       } else {
//         throw new UnauthorizedException(
//           'You are not authorized to delete this Special product',
//         );
//       }
//     } catch (error) {
//       console.error('Error deleting  Specialproduct:', error);
//       throw new InternalServerErrorException(
//         'An error occurred while deleting the Special product.',
//       );
//     }
//   }
// }

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { SpecialProduct } from './entities/special-product.entity';
import { CreateSpecialProductInput } from './dto/create-special-product.input';
import { User } from 'src/user/entities/user.entity';
import { CategoryService } from 'src/category/category.service';
import { UpdateSpecialProductInput } from './dto/update-special-product.input';

@Injectable()
export class SpecialProductService {
  constructor(
    @InjectRepository(SpecialProduct)
    private specialProductRepository: Repository<SpecialProduct>,
    private categoryService: CategoryService,
    // private specialProductPriceService: SpecialProductPriceService,
  ) {}

  async createSpecialProduct(
    createSpecialProductInput: CreateSpecialProductInput,
    user: User,
  ): Promise<SpecialProduct> {
    try {
      const category = await this.categoryService.getCategoryById(
        createSpecialProductInput.categoryId,
      );
      if (!category) {
        throw new Error(
          `Category with ID ${createSpecialProductInput.categoryId} does not exist.`,
        );
      }
      const specialProduct = this.specialProductRepository.create(
        createSpecialProductInput,
      );
      specialProduct.user = user;
      specialProduct.category = category;
      const savedSpecialProduct =
        await this.specialProductRepository.save(specialProduct);
      return savedSpecialProduct;
    } catch (error) {
      console.error('Error during product creation:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the product.',
      );
    }
  }
  async getSpecialProductById(id: string): Promise<SpecialProduct> {
    const specialproduct = await this.specialProductRepository.findOne({
      where: { id },
    });
    if (!specialproduct) {
      throw new NotFoundException(`Special Product with ID ${id} not found`);
    }
    return specialproduct;
  }
  async getAllSpecialProducts(
    userId?: string,
    categoryId?: string,
    title?: string,
    price?: string,
  ): Promise<SpecialProduct[]> {
    const query: any = {};

    if (userId) {
      query.user = { id: userId };
    }
    if (categoryId) {
      query.category = { id: categoryId };
    }
    if (title) {
      query.title = title;
    }
    if (price) {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) {
        throw new Error('Price must be a valid number');
      }

      const lowerBound = Math.floor(numericPrice);
      const upperBound = Math.ceil(numericPrice + 1) - 0.01;

      if (numericPrice % 1 === 0) {
        query.price = Between(lowerBound, upperBound);
      } else {
        query.price = Like(`${numericPrice}%`);
      }
    }
    try {
      const specialProducts = await this.specialProductRepository.find({
        where: query,
        relations: ['user', 'category'],
      });

      if (specialProducts.length === 0) {
        throw new NotFoundException('No special products found');
      }

      return specialProducts;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching special products');
    }
  }
  async getSpecialProductUserById(
    id: string,
    user: User,
  ): Promise<SpecialProduct> {
    const specialProductFound = await this.specialProductRepository.findOne({
      where: { id, user },
      relations: ['user', 'category'],
    });

    if (!specialProductFound) {
      throw new NotFoundException(`Special Product with  ${id} not found`);
    }
    return specialProductFound;
  }

  async updateSpecialProduct(
    updateSpecialProductInput: UpdateSpecialProductInput,
    user: User,
  ): Promise<SpecialProduct> {
    const product = await this.getSpecialProductById(
      // const product = await this.getSpecialProductUserById(
      updateSpecialProductInput.id,
      // user,
    );
    const { title, description, price, imageUrl, discount } =
      updateSpecialProductInput;
    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (discount) {
      product.discount = discount;
    }

    if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    if (product.prices && product.prices.length > 0) {
      product.discount = '0';

      const lastBidPrice = product.prices[product.prices.length - 1]?.price;
      if (lastBidPrice) {
        product.price = lastBidPrice;
      }
    } else {
      product.discount = discount;
    }

    try {
      await this.specialProductRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteSpecialProduct(id: string, user: User): Promise<SpecialProduct> {
    try {
      const productFound: SpecialProduct = await this.getSpecialProductUserById(
        id,
        user,
      );

      const removedProductId = productFound.id;

      if (user.roles === 'admin' || user.id === productFound.user.id) {
        const result: SpecialProduct =
          await this.specialProductRepository.remove(productFound);

        if (!result) {
          throw new NotFoundException(`Product with id ${id} not found`);
        }

        result.id = removedProductId;
        return result;
      } else {
        throw new UnauthorizedException(
          'You are not authorized to delete this product',
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the product.',
      );
    }
  }
  async deleteSpecialProductAdmin(
    id: string,
    user: User,
  ): Promise<SpecialProduct> {
    try {
      const productFound: SpecialProduct = await this.getSpecialProductById(id);

      const removedProductId = productFound.id;

      if (user.roles === 'admin') {
        const result: SpecialProduct =
          await this.specialProductRepository.remove(productFound);

        if (!result) {
          throw new NotFoundException(
            `Special Product with id ${id} not found`,
          );
        }
        result.id = removedProductId;
        return result;
      } else {
        throw new UnauthorizedException(
          'You are not authorized to delete this Special product',
        );
      }
    } catch (error) {
      console.error('Error deleting  Specialproduct:', error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the Special product.',
      );
    }
  }

  async deleteAll(): Promise<void> {
    await this.specialProductRepository.delete({});
  }
  // async getHigherBids(
  //   specialProductId: string,
  //   currentPrice: number,
  // ): Promise<SpecialProductPrice[]> {
  //   return this.specialProductPriceService.getHigherBids(
  //     specialProductId,
  //     currentPrice,
  //   );
  // }
}
