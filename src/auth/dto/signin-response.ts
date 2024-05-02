import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SigninResponse {
  @Field()
  access_token: string;
  @Field()
  id: string;

  @Field()
  username: string;
  @Field()
  fullName: string;
  @Field()
  phoneNumber: string;
  @Field()
  roles: string;
}
