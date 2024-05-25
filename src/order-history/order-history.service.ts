import { Injectable } from '@nestjs/common';
import { CreateOrderHistoryInput } from './dto/create-order-history.input';
import { UpdateOrderHistoryInput } from './dto/update-order-history.input';
import { OrderHistory } from './entities/order-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>, 
  ) {}
  async findAllOrderHistory(): Promise<OrderHistory[]> {
    return this.orderHistoryRepository.find({ relations: ['user'] });
  }
}
