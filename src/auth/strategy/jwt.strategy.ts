import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `Todo-Protect Me`,
    });
  }

  async validate(payload: any) {
    const { id, roles } = payload;
    //getuser
    const user: User = await this.usersService.getUser(id);

    if (!user) {
      throw new UnauthorizedException();
    }
    user.roles = roles;
    return user;
  }
}
