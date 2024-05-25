import { Resolver, Mutation, Args, Context, Query, ID } from '@nestjs/graphql';
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
    private orderService: OrderService,
    private productService: ProductService,
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

    const order = await this.orderService.getOrCreateOrderForUser(user);

    product.order = order;
    await this.productService.updateProductt(product);

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

  @Mutation(() => Boolean)
  async validateOrder(@Args('orderId', { type: () => ID }) orderId: string) {
    await this.orderService.validateOrder(orderId);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('orderId', { type: () => ID }) orderId: string) {
    await this.orderService.deleteOrder(orderId);
    return true; 
  }
}
