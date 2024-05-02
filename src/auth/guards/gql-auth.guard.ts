import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().loginUserInput;

    return request;
  }
}
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { AuthService } from '../auth.service';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class GqlAuthGuard implements CanActivate {
//   constructor(
//     private readonly userService: UserService,

//     private readonly authService: AuthService,
//     private readonly jwtService: JwtService, // Injecting JwtService to validate tokens
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const gqlContext = GqlExecutionContext.create(context);
//     const req = gqlContext.getContext().req;

//     const authorizationHeader = req.headers.authorization;
//     if (!authorizationHeader) {
//       return false; // No authorization header
//     }

//     const token = authorizationHeader.split(' ')[1]; // Expecting "Bearer <token>"
//     if (!token) {
//       return false; // No token in the header
//     }

//     try {
//       const decodedToken = this.jwtService.verify(token); // Verify JWT token
//       const user = await this.userService.getUser(decodedToken.sub); // Find user by ID from token

//       if (!user) {
//         return false; // User not found
//       }

//       req.user = user; // Set the user in the request context
//       return true; // Token is valid, user is set
//     } catch (error) {
//       return false; // Token verification failed
//     }
//   }
// }
