import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductStatus } from '../product-status.enum';
import { User } from 'src/user/entities/user.entity';
@Entity()
@ObjectType('Product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
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
  status: ProductStatus;

  @Column()
  @Field()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.products)
  @Field(() => User)
  user: User;
}
