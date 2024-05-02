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

  @Column({ default: 'In Stock' })
  @Field()
  status: ProductStatus;

  @Column()
  @Field()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId' })
  // @Field(() => User)
  user: User;

  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  // @ManyToOne(() => Category, (category) => category.products)
  // @JoinTable({
  //   name: 'product_categories',
  //   // joinColumn: { name: 'productId', referencedColumnName: 'id' },
  //   // inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  // })
  // @JoinColumn({ name: 'categoryId' })
  // @Field(() => Category)
  // category: Category;
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  @Field(() => Category, { nullable: false }) // Ensure it's marked as non-nullable in the schema
  category: Category;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: false })
  nbrLike: number;

  @ManyToMany(() => User, (user) => user.likedProducts)
  @Field(() => [User], { nullable: true })
  @JoinTable() // Allows the linking between products and users
  likedBy?: User[];

  @Column({ type: 'int', default: 1 })
  @Field(() => Int, { nullable: false })
  quantity: number;
}
