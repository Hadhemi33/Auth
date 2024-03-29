import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';

import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType('User')
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true, unique: true })
  @Field()
  fullName: string;

  @Column({ nullable: true })
  @Field()
  phoneNumber: string;

  @OneToMany(() => Product, (product) => product.user)
  @Field(() => [Product])
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  @Field(() => [Order])
  orders: Order[];

  @OneToMany(() => Category, (category) => category.user)
  @Field(() => [Category])
  categories: Category[];
}
