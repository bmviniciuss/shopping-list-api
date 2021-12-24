import jwt from 'jsonwebtoken'

import { Encrypter } from '../protocols/jwt'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}
  async encrypt (plaintext: string): Promise<string> {
    const token = jwt.sign({ sub: plaintext }, this.secret)
    return Promise.resolve(token)
  }
}
