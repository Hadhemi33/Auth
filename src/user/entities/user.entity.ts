import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  @OneToMany(() => Product, (product) => product.user)
  @Field(() => [Product])
  products: Product[];
}
