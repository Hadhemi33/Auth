import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => User, (user) => user.categories)
  // @Field(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Product, (product) => product.categories) // Reverse relationship with Product
  @Field(() => [Product])
  products: Product[];
}
