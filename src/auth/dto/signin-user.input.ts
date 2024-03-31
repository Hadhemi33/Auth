import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
@InputType()
export class SigninUserInput {
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
}
