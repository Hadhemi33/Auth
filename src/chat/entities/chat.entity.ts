import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
@ObjectType('Chat')
export class Chat {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;
  @Field()
  @Column()
  senderId: string;
  @Field()
  @Column()
  receiverId: string;
  @Field()
  @Column()
  content: string;
  @Field()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
