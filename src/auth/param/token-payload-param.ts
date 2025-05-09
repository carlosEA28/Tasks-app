import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.contants';

export const TokenPaylodParam = createParamDecorator(
  (date: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();

    return request[REQUEST_TOKEN_PAYLOAD_NAME];
  },
);
