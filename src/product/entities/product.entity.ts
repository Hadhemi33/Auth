import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductStatus } from '../product-status.enum';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';

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
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Order, (order) => order.products)
  // @Field(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_categories', // Join table name
    joinColumn: { name: 'productId', referencedColumnName: 'id' }, // Column name on the Product side
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }, // Column name on the Category side
  })
  @Field(() => [Category])
  categories: Category[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageUrl: string;
}
