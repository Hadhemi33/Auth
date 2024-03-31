import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
@InputType()
export class SignupUserInput {
  @Field()
  @IsString()
  @IsEmail()
  username: string;

  @Field()
  @IsString()
  // @Length(8, 50)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password is too weak',
  // })
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  fullName?: string;

  @Field({ nullable: true })
  phoneNumber: string;

  // @Field()
  // role: string;
}
