// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { verify } from 'jsonwebtoken';
// import { Observable } from 'rxjs';
// import { Socket } from 'socket.io';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class WsJwtGuard implements CanActivate {
//   constructor(private  configService: ConfigService) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     if (context.getType() !== 'ws') {
//       return true;
//     }

//     const client: Socket = context.switchToWs().getClient();

//     try {
//       this.validateToken(client); // Call instance method with 'this'
//     } catch (error) {
//       throw new UnauthorizedException('Invalid or missing token.');
//     }

//     return true;
//   }

//   private validateToken(client: Socket) {
//     const { authorization } = client.handshake.headers;

//     if (!authorization) {
//       throw new UnauthorizedException('Missing authorization header.');
//     }

//     const token = authorization.split(' ')[1];
//     const secret = this.configService.get('JWT_SECRET', 'default_secret');

//     if (!token) {
//       throw new UnauthorizedException('Token missing in authorization header.');
//     }

//     verify(token, secret); // Throws error if token is invalid
//   }
// }
