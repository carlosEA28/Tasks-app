import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.contants';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurartion: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token nao encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfigurartion,
      );

      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload; // injetando as configs do payload na request, como o id, email,etc
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Nao autorizado');
    }

    return true;
  }

  extractTokenHeader(request: Request) {
    const authToken = request.headers.authorization;

    if (!authToken || typeof authToken !== 'string') {
      return;
    }

    return authToken.split(' ')[1];
  }
}
