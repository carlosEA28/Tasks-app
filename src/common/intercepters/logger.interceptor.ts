import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';

import { Observable } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // throw new Error('Method not implemented.');

    console.log('UEPA');
    return next.handle().pipe();
  }
}
