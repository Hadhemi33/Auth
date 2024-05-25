import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { OrderHistoryService } from 'src/order-history/order-history.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
    private orderHistoryService: OrderHistoryService,
  ) {}

  async recalculateTotalPrice(order: Order): Promise<Order> {
    const totalPrice = order.products.reduce((sum, product) => {
      return sum + parseFloat(product.price);
    }, 0);

    order.totalPrice = totalPrice.toFixed(2);
    return this.orderRepository.save(order);
  }
  getRepository() {
    return this.orderRepository;
  }
  async getOrCreateOrderForUser(user: User): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['products'],
    });

    if (order && !order.paid) {
      return order;
    }
    order = this.orderRepository.create({
      createdAt: new Date().toISOString(),
      user,
      totalPrice: '0.00',
      products: [],
      paid: false,
    });

    return this.orderRepository.save(order);
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrder(order: Order): Promise<Order> {
    order = await this.recalculateTotalPrice(order);
    return this.orderRepository.save(order);
  }

  async saveOrderToHistory(order: Order, userId: string): Promise<void> {
    const historyEntry = new OrderHistory();
    historyEntry.totalPrice = order.totalPrice;
    historyEntry.user.id = userId;
    historyEntry.paidAt = new Date();

    historyEntry.products = order.products.map((product) => {
      const prod = new Product();
      prod.id = product.id;
      prod.title = product.title;
      prod.price = product.price;
      prod.history = historyEntry;
      return prod;
    });

    await this.orderHistoryRepository.save(historyEntry);

    await Promise.all(
      historyEntry.products.map((product) =>
        this.productRepository.save(product),
      ),
    );
  }

  async validateOrder(orderId: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    const userId = order.products.length > 0 ? order.products[0].user.id : null;

    await this.saveOrderToHistory(order, userId);

    await this.orderRepository.delete(order.id);

    await Promise.all(
      order.products.map((product) =>
        this.productRepository.delete(product.id),
      ),
    );
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'products'],
    });
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.getOrderById(id);

    await Promise.all(
      order.products.map(async (product) => {
        product.order = null;
        await this.productRepository.save(product);
      }),
    );

    console.log('Deleting the order...');
    await this.orderRepository.delete(id);
  }
}
