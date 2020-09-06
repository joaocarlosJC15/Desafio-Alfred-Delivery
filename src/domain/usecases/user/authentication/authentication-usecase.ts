import { Authentication, AuthenticationModel } from './protocols/authentication-user'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'
import { HashComparer } from '@/domain/protocols/criptography/hash/hash-comparer'
import { Encrypter } from '@/domain/protocols/criptography/jwt/encrypter'
import { UpdateJwtTokenRepository } from '@/domain/protocols/db/user/update-jwt-token-repository'
import { NotFoundError, InternalServerError } from '@/errors'
import { UnauthorizedError } from '@/errors/unauthorized-error'

export class AuthenticationUseCase implements Authentication {
  constructor (
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateJwtTokenRepository: UpdateJwtTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const user = await this.getUserByEmailRepository.getByEmail(authentication.email)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado. Email ou senha inválidos')
    }

    const isValid = await this.hashComparer.compare(authentication.password, user.password)
    if (!isValid) {
      throw new UnauthorizedError()
    }

    const token = await this.encrypter.encrypt(user.id)
    if (!token) {
      throw new InternalServerError()
    }
    await this.updateJwtTokenRepository.updateJwtToken(user.id, token)

    return token
  }
}
