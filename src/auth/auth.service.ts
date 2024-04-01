import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { SignupResponse } from './dto/signup-response';

import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { SigninResponse } from './dto/signin-response';
import { JwtService } from '@nestjs/jwt';
import { SignupUserInput } from './dto/signup-user.input';
import { CurrentUser } from './get-current-user.decorator';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  async signup(signupUserInput: SignupUserInput): Promise<SignupResponse> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupUserInput.password, salt);
    signupUserInput.password = hashedPassword;

    return this.usersService.createUser(signupUserInput);
  }
  async validateUser(username: string, password: string): Promise<User> {
    //getuser
    const user = await this.usersService.getUserByEmail(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async signin(user: User): Promise<SigninResponse> {
    const { username, fullName, phoneNumber, roles } = user;
    const access_token = await this.jwtService.sign({
      fullName,
      username,
      sub: user.id,
      phoneNumber,
      roles,
    });
    if (!access_token) {
      throw new InternalServerErrorException();
    }
    return {
      roles,
      fullName,
      phoneNumber,
      access_token,
      username,
    };
  }
  // async signout(): Promise<void> {
  //   try {
  //     await AsyncStorage.removeItem('access_token');
  //   } catch (error) {
  //     console.error('Error removing access token:', error);
  //   }
  // }
}
