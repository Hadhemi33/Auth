import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderHistoryService } from './order-history.service';
import { OrderHistory } from './entities/order-history.entity';
import { CreateOrderHistoryInput } from './dto/create-order-history.input';
import { UpdateOrderHistoryInput } from './dto/update-order-history.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => OrderHistory)
export class OrderHistoryResolver {
  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  @Query(() => [OrderHistory])
  @UseGuards(JwtAuthGuard) // If needed, use guards for security
  async getAllOrderHistory(): Promise<OrderHistory[]> {
    return this.orderHistoryService.findAllOrderHistory();
  }
}
