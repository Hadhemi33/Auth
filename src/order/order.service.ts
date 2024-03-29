import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });
  }
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
  
    const newOrder = this.orderRepository.create({
      createdAt: new Date().toISOString(),
      ...createOrderDto,
    });
    return this.orderRepository.save(newOrder);
  }


  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
