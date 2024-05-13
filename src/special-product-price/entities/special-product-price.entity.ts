import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SpecialProduct } from 'src/special-product/entities/special-product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType('SpecialProductPrice')
export class SpecialProductPrice {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  price: string;

  @ManyToOne(() => SpecialProduct, (specialProduct) => specialProduct.prices)
  @JoinColumn({ name: 'specialProductId' })
  @Field(() => SpecialProduct)
  specialProduct: SpecialProduct;

  @ManyToOne(() => User, (user) => user.specialProductPrices)
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;
}
