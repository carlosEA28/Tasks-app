import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;

    if (auth) {
      console.log('Token', auth);
    }

    next();
  }
}
