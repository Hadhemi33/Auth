import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { ProductService } from 'src/product/product.service';
import { Order } from './entities/order.entity';

import { UpdateOrderInput } from './dto/update-order.input';
import { CurrentUser } from 'src/auth/get-current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}
  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async addProductToOrder(
    @CurrentUser() user: User,
    @Args('productId', { type: () => String }) productId: string,
    @Args('orderId', { type: () => String, nullable: true }) orderId?: string,
  ): Promise<Order> {
    const product = await this.productService.getProductById(productId);

    if (product.order) {
      throw new Error(
        `Product with ID ${productId} is already in another order`,
      );
    }

    // Get or create an order based on the latest unpaid order logic
    const order = await this.orderService.getOrCreateOrderForUser(user);

    product.order = order;
    await this.productService.updateProductt(product); // This method might need fixing depending on your service implementation

    order.products.push(product); // Add product to order
    await this.orderService.updateOrder(order); // Update and save the order

    return order; // Return the updated order
  }

  // @Mutation(() => Order)
  // @UseGuards(JwtAuthGuard)
  // async addProductToOrder(
  //   @CurrentUser() user: User,
  //   @Args('productId', { type: () => String }) productId: string,
  //   @Args('orderId', { type: () => String, nullable: true }) orderId?: string,
  // ): Promise<Order> {
  //   let order: Order;

  //   // Always create a new order for each user
  //   order = await this.orderService.createOrderForUser(user);

  //   const product = await this.productService.getProductById(productId);

  //   if (product.order) {
  //     throw new Error(
  //       `Product with ID ${productId} is already in another order`,
  //     );
  //   }

  //   product.order = order;
  //   await this.productService.updateProductt(product);

  //   order.products.push(product);
  //   await this.orderService.updateOrder(order);

  //   return order;
  // }
  @Query(() => Order)
  async getOrderById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Query(() => [Order])
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  // async updateOrder(
  //   @Args('updateOrderInput', { type: () => UpdateOrderInput })
  //   updateOrderInput: UpdateOrderInput,
  // ): Promise<Order> {
  //   const order = await this.orderService.getOrderById(updateOrderInput.id);

  //   if (!order) {
  //     throw new NotFoundException(
  //       `Order with ID ${updateOrderInput.id} not found`,
  //     );
  //   }

  //   if (updateOrderInput.paid !== undefined) {
  //     order.paid = updateOrderInput.paid;
  //     await this.orderService.updateOrder(order);
  //     if (order.paid) {
  //       console.log('Order is paid, deleting the order...');
  //       await this.orderService.deleteOrder(order.id);
  //     }
  //   }

  //   return order;
  // }
  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Args('updateOrderInput', { type: () => UpdateOrderInput })
    updateOrderInput: UpdateOrderInput,
  ): Promise<Order> {
    const order = await this.orderService.getOrderById(updateOrderInput.id);

    if (!order) {
      throw new NotFoundException(
        `Order with ID ${updateOrderInput.id} not found`,
      );
    }

    if (updateOrderInput.paid !== undefined) {
      order.paid = updateOrderInput.paid;
      await this.orderService.updateOrder(order);

      if (order.paid) {
        await this.orderService.deleteOrderIfPaid(order); // This handles saving to history and deleting
      }
    }

    return order;
  }
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteOrder(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    try {
      await this.orderService.deleteOrder(id);
      return true;
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error);
      return false;
    }
  }
}
