import { Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hashign.service';
import { BcryptService } from './hash/bcrypt.service';

@Module({
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
})
export class AuthModule {}
