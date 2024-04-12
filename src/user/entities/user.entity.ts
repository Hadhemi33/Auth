import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Order } from 'src/order/entities/order.entity';

import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
@ObjectType('User')
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  username: string;
  // Define the one-to-many relationship with the Chat entity for sent messages
  // @OneToMany(() => Chat, (chat) => chat.sender)
  // @Field(() => [Chat])
  // sentMessages: Chat[];

  // // Define the one-to-many relationship with the Chat entity for received messages
  // @OneToMany(() => Chat, (chat) => chat.receiver)
  // @Field(() => [Chat])
  // receivedMessages: Chat[];
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
  @Column()
  @Field()
  roles: string;
}
