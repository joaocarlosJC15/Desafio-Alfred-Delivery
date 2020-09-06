import { BcryptAdapter } from '@/infra/criptography/hash/bcrypt-adapter/bcrypt-adapter'
import { salt, jwtSecret } from '@/main/config/env'
import { Authentication } from '@/domain/usecases/user/authentication/protocols/authentication-user'
import { UserRepository } from '@/infra/db/postgresql/user/user-repository'
import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter'
import { AuthenticationUseCase } from '@/domain/usecases/user/authentication/authentication-usecase'

export const makeAuthenticationUseCase = (): Authentication => {
  const userRepository = new UserRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(jwtSecret)

  const authenticationUseCase = new AuthenticationUseCase(userRepository, bcryptAdapter, jwtAdapter, userRepository)

  return authenticationUseCase
}
