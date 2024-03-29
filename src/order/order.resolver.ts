import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Query(() => Order)
  async order(@Args('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('order') createOrderDto: CreateOrderDto, 
  ): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Mutation(() => Order)
  async updateOrder(
    @Args('id') id: string,
    @Args('order') updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('id') id: string): Promise<boolean> {
    await this.orderService.remove(id);
    return true;
  }
}
