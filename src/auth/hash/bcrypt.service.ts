import { HashingServiceProtocol } from './hashign.service';
import * as bcrypt from 'bcryptjs';

export class BcryptService extends HashingServiceProtocol {
  async hash(passord: string): Promise<string> {
    const hash = await bcrypt.genSalt();

    return bcrypt.hash(passord, hash);
  }
  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
