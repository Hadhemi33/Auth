import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { User } from 'src/user/entities/user.entity';
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
@Entity()
@ObjectType('SpecialProduct')
export class SpecialProduct {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

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
  createdAt: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int, { nullable: false })
  nbrLike: number;

  @Column()
  @Field()
  discount: string;

  @Column()
  @Field()
  endingIn: string;

  @ManyToOne(() => Category, (category) => category.specialProducts, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  @Field(() => Category, { nullable: true })
  category: Category;

  @ManyToOne(() => User, (user) => user.specialProducts)
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @ManyToMany(() => User, (user) => user.likedSpecialProducts, {
    cascade: true,
  })
  @JoinTable({
    name: 'special_product_likes',
    joinColumn: { name: 'specialProductId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  @Field(() => [User], { nullable: true })
  likedBy?: User[];

  @OneToMany(() => SpecialProductPrice, (price) => price.specialProduct)
  @Field(() => [SpecialProductPrice])
  prices: SpecialProductPrice[];
}
