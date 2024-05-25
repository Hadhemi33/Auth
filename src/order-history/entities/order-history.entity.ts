import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType('OrderHistory')
export class OrderHistory {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;
  @Field()
  @Column()
  totalPrice: string;

  @ManyToOne(() => User, (user) => user.OrderHistories, { eager: true })
  @Field(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @Column()
  paidAt: Date;

  @OneToMany(() => Product, (product) => product.history, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => [Product])
  products: Product[];
}
