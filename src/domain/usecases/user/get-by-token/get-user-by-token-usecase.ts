import { GetUserByToken } from './protocols/get-user-by-token'
import { Decrypter } from '@/domain/protocols/criptography/jwt/decrypter'
import { UserModel } from '@/domain/models/user'
import { GetUserByTokenRepository } from '@/domain/protocols/db/user/get-user-by-token-repository'
import { UnauthorizedError } from '@/errors'

export class GetUserByTokenUseCase implements GetUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getUserByTokenRepository: GetUserByTokenRepository
  ) {}

  async getByToken (token: string): Promise<UserModel> {
    const result = await this.decrypter.decrypt(token)

    if (!result) {
      throw new UnauthorizedError()
    }

    const user = await this.getUserByTokenRepository.getByToken(token)

    if (!user) {
      throw new UnauthorizedError()
    }

    return user
  }
}
