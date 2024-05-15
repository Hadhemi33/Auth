import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType('Notification')
export class Notification {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  message: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @ManyToOne(
    () => SpecialProductPrice,
    (specialProductPrice) => specialProductPrice.notifications,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'specialProductPriceId' })
  @Field(() => SpecialProductPrice)
  specialProductPrice: SpecialProductPrice;
}
