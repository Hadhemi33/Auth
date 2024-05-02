import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  // (data: unknown, context: ExecutionContext) => {
  //   const ctx = GqlExecutionContext.create(context);
  //   console.log('CurrentUser:', ctx.getContext().req.user); // Debug here
  //   return ctx.getContext().req.user;
  // },
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext().req.user;
    console.log('Extracted User:', user); // Log to check user info
    return user;
  },
);
