// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { User } from 'src/user/entities/user.entity';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private usersService: UserService,
//     private configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'JWT_SECRET',
//     });
//   }

//   async validate(payload: any) {
//     const { id, roles } = payload;
//     //getuser
//     const user: User = await this.usersService.getUser(id);

//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     user.roles = roles;
//     return user;
//   }
// }
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Corrected key retrieval
      
    });
  }

  async validate(payload: any): Promise<User> {
    const { sub: userId, roles } = payload; // Use 'sub' for user ID
    const user = await this.userService.getUser(userId); // Renamed method for clarity

    if (!user) {
      Logger.error(`User with ID ${userId} not found`); // Log error
      throw new UnauthorizedException('User not found');
    }

    user.roles = roles;
    return user;
  }
}
