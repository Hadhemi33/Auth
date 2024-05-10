import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderHistory) // Inject OrderHistory repository
    private readonly orderHistoryRepository: Repository<OrderHistory>,
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
  async createOrderForUser(user: User): Promise<Order> {
    const newOrder = this.orderRepository.create({
      createdAt: new Date().toISOString(),
      user,
      totalPrice: '0.00', // Default initial total price
      products: [],
      paid: false, // Default to unpaid
    });

    return this.orderRepository.save(newOrder); // Save and return the new order
  }
  async getOrCreateOrderForUser(user: User): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['products'],
    });

    // If there's an existing order and it's unpaid, return it
    if (order && !order.paid) {
      return order;
    }

    // Otherwise, create a new order
    order = this.orderRepository.create({
      createdAt: new Date().toISOString(),
      user,
      totalPrice: '0.00', // Default total price
      products: [],
      paid: false, // New orders start unpaid
    });

    return this.orderRepository.save(order);
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
    order = await this.recalculateTotalPrice(order);
    return this.orderRepository.save(order);
  }
  async saveOrderToHistory(order: Order): Promise<void> {
    const historyEntry = new OrderHistory();
    historyEntry.totalPrice = order.totalPrice;
    historyEntry.user = order.user;
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
  // Delete order if paid
  // async deleteOrderIfPaid(order: Order): Promise<void> {
  //   if (order.paid) {
  //     await this.orderRepository.delete(order.id);
  //   }
  // }
  async deleteOrderIfPaid(order: Order): Promise<void> {
    if (order.paid) {
      // Remove the reference to the order from products
      await Promise.all(
        order.products.map(async (product) => {
          product.order = null; // Clear the reference to the order
          await this.productRepository.save(product); // Save the product with the cleared reference
        }),
      );

      await this.saveOrderToHistory(order); // Save to history before deleting
      await this.orderRepository.delete(order.id); // Delete the original order
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
