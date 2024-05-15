import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { Order } from 'src/order/entities/order.entity';

import { Product } from 'src/product/entities/product.entity';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
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

  @Column()
  @Field()
  roles: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Product, (product) => product.user, { eager: true })
  @Field(() => [Product])
  products: Product[];

  @OneToMany(() => SpecialProduct, (specialProduct) => specialProduct.user, {
    eager: true,
  })
  @Field(() => [SpecialProduct])
  specialProducts: SpecialProduct[];

  @OneToMany(() => Order, (order) => order.user)
  @Field(() => [Order])
  orders: Order[];
  @OneToMany(() => OrderHistory, (OrderHistories) => OrderHistories.user)
  @Field(() => [OrderHistory])
  OrderHistories: OrderHistory[];

  @OneToMany(() => Category, (category) => category.user)
  @Field(() => [Category])
  categories: Category[];

  @ManyToMany(() => Product, (product) => product.likedBy)
  @Field(() => [Product], { nullable: true })
  likedProducts?: Product[];

  @ManyToMany(() => SpecialProduct, (specialProduct) => specialProduct.likedBy)
  @Field(() => [SpecialProduct], { nullable: true })
  likedSpecialProducts?: SpecialProduct[];

  @OneToMany(() => SpecialProductPrice, (price) => price.user)
  @Field(() => [SpecialProductPrice])
  specialProductPrices: SpecialProductPrice[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
