import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductStatus } from '../product-status.enum';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity'; // Import Order entity

@Entity()
@ObjectType('Product')
export class Product {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  price: string;

  @Column()
  @Field()
  status: ProductStatus;

  @Column()
  @Field()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.products)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Order, (order) => order.products)
  @Field(() => Order)
  order: Order;
  
  @OneToMany(() => Category, (category) => category.product)
  @Field(() => [Category])
  categories: Category[];
}
