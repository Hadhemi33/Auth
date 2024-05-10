import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';

import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType('Order')
export class Order {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field({ defaultValue: new Date().toISOString() })
  createdAt: string;

  @Column()
  @Field()
  totalPrice: string;

  @ManyToOne(() => User, (user) => user.orders)
  @Field(() => User)
  user: User;

  @OneToMany(() => Product, (product) => product.order)
  @Field(() => [Product])
  products: Product[];

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, { nullable: false })
  paid: boolean;
  
}
