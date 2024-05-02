import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Roles } from '../dto/roles.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Roles[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user) {
      return false;
    }

    // return requiredRoles.some((role) => user.roles.includes(role));
    if (typeof user.roles === 'string') {
      // If user.roles is a single role (not an array), check equality directly
      return requiredRoles.includes(user.roles as Roles);
    }

    // If user.roles is an array, check if any of the required roles match
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}

// @UseGuards(JwtAuthGuard, RoleGuard)
// @SetMetadata('roles', ['user'])
