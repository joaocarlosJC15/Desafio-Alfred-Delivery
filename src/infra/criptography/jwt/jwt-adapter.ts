import jwt from 'jsonwebtoken'

import { Encrypter } from '@/domain/protocols/criptography/jwt/encrypter'
import { Decrypter } from '@/domain/protocols/criptography/jwt/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {
    this.secret = secret
  }

  async encrypt (id: number): Promise<string> {
    const acessToken = await jwt.sign({ id }, this.secret)
    return acessToken
  }

  async decrypt (token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secret)
    return value
  }
}
