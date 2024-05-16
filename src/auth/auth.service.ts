// import {
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';

// import { SignupResponse } from './dto/signup-response';

// import * as bcrypt from 'bcrypt';
// import { UserService } from 'src/user/user.service';
// import { User } from 'src/user/entities/user.entity';
// import { SigninResponse } from './dto/signin-response';
// import { JwtService } from '@nestjs/jwt';
// import { SignupUserInput } from './dto/signup-user.input';
// import { CurrentUser } from './get-current-user.decorator';
// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UserService,
//     private jwtService: JwtService,
//   ) {}
//   async signup(signupUserInput: SignupUserInput): Promise<SignupResponse> {
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(signupUserInput.password, salt);
//     signupUserInput.password = hashedPassword;

//     return this.usersService.createUser(signupUserInput);
//   }
//   async validateUser(username: string, password: string): Promise<User> {
//     //getuser
//     const user = await this.usersService.getUserByEmail(username);

//     if (user && (await bcrypt.compare(password, user.password))) {
//       return user;
//     }
//     throw new UnauthorizedException();
//   }

//   async signin(user: User): Promise<SigninResponse> {
//     const { username, fullName, phoneNumber, roles } = user;
//     const access_token = await this.jwtService.sign({
//       fullName,
//       username,
//       sub: user.id,
//       phoneNumber,
//       roles,
//     });
//     if (!access_token) {
//       throw new InternalServerErrorException();
//     }
//     return {
//       roles,
//       fullName,
//       phoneNumber,
//       access_token,
//       username,
//     };
//   }

// }
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { SignupUserInput } from './dto/signup-user.input';
import { SigninResponse } from './dto/signin-response';
import { SignupResponse } from './dto/signup-response';

@Injectable()
export class AuthService {
  constructor(
    private  userService: UserService,
    private  jwtService: JwtService,
  ) {}

  async signup(signupUserInput: SignupUserInput): Promise<SignupResponse> {
    const salt = await bcrypt.genSalt(); // Generate a salt for hashing
    const hashedPassword = await bcrypt.hash(signupUserInput.password, salt); // Hash the password
    signupUserInput.password = hashedPassword;

    return this.userService.createUser(signupUserInput);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email); // Using email for user identification

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async signin(user: User): Promise<SigninResponse> {
    const { id, username, fullName, phoneNumber, roles,imageUrl } = user; // Consistent variable retrieval
    const accessToken = this.jwtService.sign({
      sub: id,
      username,
      fullName,
      phoneNumber,
      roles,
      imageUrl,
    });

    if (!accessToken) {
      throw new InternalServerErrorException('Error generating token');
    }

    return {
      id,
      access_token: accessToken,
      fullName,
      username,
      roles,
      phoneNumber,
      imageUrl,
    };
  }
}
