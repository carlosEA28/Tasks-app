import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hashign.service';
import { BcryptService } from './hash/bcrypt.service';

@Global() //Modulo global - Pode ser usado na aplicação interira(não precisa importar em outros módulos)
@Module({
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule {}
