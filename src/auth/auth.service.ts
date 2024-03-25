import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { SignupResponse } from './dto/signup-response';
import { SigninUserInput } from './dto/signin-user.input';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { SigninResponse } from './dto/signin-response';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  async signup(loginUserInput: SigninUserInput): Promise<SignupResponse> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(loginUserInput.password, salt);
    loginUserInput.password = hashedPassword;

    return this.usersService.createUser(loginUserInput);
  }
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.getUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException();
  }
  async signin(user: User): Promise<SigninResponse> {
    const username = user.username;
    const access_token = await this.jwtService.sign({
      username,
      sub: user.id,
    });
    if (!access_token) {
      throw new InternalServerErrorException();
    }
    return {
      access_token,
      username,
    };
  }
}
