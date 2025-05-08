import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashign.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurartion: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {
    console.log(jwtConfigurartion);
  }

  async authenticate(singInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: singInDto.email,
      },
    });

    if (!user) {
      throw new HttpException('Falha ao fazer login', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatch = this.hashingService.compare(
      singInDto.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new HttpException(
        'Senha/Email incorretos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.jwtConfigurartion.secret,
        audience: this.jwtConfigurartion.audience,
        expiresIn: this.jwtConfigurartion.expiress,
        issuer: this.jwtConfigurartion.issuer,
      },
    );

    return {
      id: user.id,
      email: user.email,
      password: user.passwordHash,
      token: token,
    };
  }
}
