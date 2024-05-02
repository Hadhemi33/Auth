import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Recalculate the total price based on the products in the order
  async recalculateTotalPrice(order: Order): Promise<Order> {
    const totalPrice = order.products.reduce((sum, product) => {
      return sum + parseFloat(product.price); // Ensure price is converted to number
    }, 0); // Initialize with zero

    order.totalPrice = totalPrice.toFixed(2); // Format to two decimal places
    return this.orderRepository.save(order); // Save the updated order with new total price
  }

  // Get or create an order for a user
  async getOrCreateOrderForUser(user: User): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['products'],
    });

    if (!order) {
      order = this.orderRepository.create({
        createdAt: new Date().toISOString(),
        user,
        totalPrice: '0.00',
        products: [],
        paid: false, // Default to false
      });
      order = await this.orderRepository.save(order);
    }

    return order;
  }

  // Get order by ID
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

  // Update order and recalculate the total price
  async updateOrder(order: Order): Promise<Order> {
    order = await this.recalculateTotalPrice(order); // Recalculate total price before saving
    return this.orderRepository.save(order);
  }

  // Delete order if paid
  async deleteOrderIfPaid(order: Order): Promise<void> {
    if (order.paid) {
      await this.orderRepository.delete(order.id);
    }
  }

  // Find all orders
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'products'],
    });
  }
  async deleteOrder(id: string): Promise<void> {
    const order = await this.getOrderById(id);

    // Check if the order has products and delete them
    if (order.products && order.products.length > 0) {
      console.log('Deleting associated products...'); // Debugging information
      for (const product of order.products) {
        await this.productRepository.delete(product.id); // Delete the product
      }
    }

    console.log('Deleting the order...'); // Debugging information
    await this.orderRepository.delete(id); // Delete the order
  }
}
