import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { ProductService } from 'src/product/product.service';
import { Order } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard) // Ensure only authenticated users can add products to orders
  async addProductToOrder(
    @Context() context, // Reorder to avoid required-after-optional error
    @Args('productId', { type: () => String }) productId: string,
    @Args('orderId', { type: () => String, nullable: true }) orderId?: string,
    // Optional parameter
  ): Promise<Order> {
    // Get the current user from context
    const user = context.req.user;

    // Fetch the order or create a new one for the user
    let order: Order;
    if (orderId) {
      order = await this.orderService.getOrderById(orderId);
    } else {
      order = await this.orderService.getOrCreateOrderForUser(user.id);
    }

    // Get the product and check if it's already part of an order
    const product = await this.productService.getProductById(productId);

    if (product.order) {
      throw new Error(
        `Product with ID ${productId} is already in another order`,
      );
    }

    // Add the product to the order
    product.order = order; // Assign the order to the product
    await this.productService.updateProductt(product); // Update the product

    if (!order.products) {
      order.products = [];
    }

    order.products.push(product); // Add product to the order's product list
    await this.orderService.updateOrder(order); // Update the order

    return order; // Return the updated order
  }
  // Query to get order by ID
  @Query(() => Order)
  async getOrderById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Order> {
    return this.orderService.getOrderById(id); // Fetch the order by its ID
  }

  // Query to get all orders
  @Query(() => [Order]) // Note the return type, indicating an array of Orders
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.findAll(); // Fetch all orders
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard) // Authorization guard
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
      await this.orderService.updateOrder(order); // Save the updated order

      if (order.paid) {
        // Ensure the delete method is reached
        console.log('Order is paid, deleting the order...'); // Debugging information
        await this.orderService.deleteOrder(order.id); // Delete if paid is true
      }
    }

    return order; // Return the updated order
  }
  @Mutation(() => Boolean) // Mutation to delete an order
  @UseGuards(JwtAuthGuard) // Ensure only authenticated users can delete orders
  async deleteOrder(
    @Args('id', { type: () => String }) id: string, // ID of the order to delete
  ): Promise<boolean> {
    // Check if the order exists before attempting to delete
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Attempt to delete the order
    try {
      await this.orderService.deleteOrder(id); // Call the service method to delete the order
      return true; // Return true on successful deletion
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error); // Log error details
      return false; // Return false if the deletion fails
    }
  }
}
