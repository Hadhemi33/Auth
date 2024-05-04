import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType('SpecialProduct')
export class SpecialProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  price: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  discount: number;

  @Column()
  @Field()
  time: string;
  @ManyToOne(() => Category, (category) => category.specialProducts)
  @JoinColumn({ name: 'categoryId' })
  @Field(() => Category, { nullable: false }) // Ensure it's marked as non-nullable in the schema
  category: Category;
  @ManyToOne(() => User, (user) => user.specialProducts)
  @JoinColumn({ name: 'userId' })
  // @Field(() => User)
  user: User;
}
