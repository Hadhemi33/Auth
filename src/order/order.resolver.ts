import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { ProductService } from 'src/product/product.service';
import { Order } from './entities/order.entity';

import { UpdateOrderInput } from './dto/update-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async addProductToOrder(
    @Context() context,
    @Args('productId', { type: () => String }) productId: string,
    @Args('orderId', { type: () => String, nullable: true }) orderId?: string,
  ): Promise<Order> {
    const user = context.req.user;

    let order: Order;
    if (orderId) {
      order = await this.orderService.getOrderById(orderId);
    } else {
      order = await this.orderService.getOrCreateOrderForUser(user.id);
    }

    const product = await this.productService.getProductById(productId);

    if (product.order) {
      throw new Error(
        `Product with ID ${productId} is already in another order`,
      );
    }

    product.order = order;
    await this.productService.updateProductt(product);

    if (!order.products) {
      order.products = [];
    }

    order.products.push(product);
    await this.orderService.updateOrder(order);

    return order;
  }

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
        console.log('Order is paid, deleting the order...');
        await this.orderService.deleteOrder(order.id);
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
