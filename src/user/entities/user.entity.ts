import { ObjectType, Field, ID } from '@nestjs/graphql';

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
}
