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
  @Field(() => User)
  user: User;

  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  @Field(() => Category, { nullable: true })
  category: Category;

  @Column({ nullable: true })
  @Field({ nullable: true })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: false })
  nbrLike: number;

  @ManyToMany(() => User, (user) => user.likedProducts, { cascade: true })
  @JoinTable({
    name: 'product_likes', // Custom join table name
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  @Field(() => [User], { nullable: true })
  likedBy?: User[];

  @Column({ type: 'int', default: 1 })
  @Field(() => Int, { nullable: false })
  quantity: number;
}
