// Uma classe abstrata apenas para servir como um tipo

export abstract class HashingServiceProtocol {
  abstract hash(passord: string): Promise<string>;
  abstract compare(password: string, passwordHash: string): Promise<boolean>;
}
