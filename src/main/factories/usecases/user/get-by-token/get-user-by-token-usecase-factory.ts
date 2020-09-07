import { GetUserByTokenUseCase } from '@/domain/usecases/user/get-by-token/get-user-by-token-usecase'
import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter'
import { jwtSecret } from '@/main/config/env'
import { UserRepository } from '@/infra/db/postgresql/user/user-repository'
import { GetUserByToken } from '@/domain/usecases/user/get-by-token/protocols/get-user-by-token'

export const makeGetUserByTokenUsecase = (): GetUserByToken => {
  const jwtAdapter = new JwtAdapter(jwtSecret)
  const userRepository = new UserRepository()

  return new GetUserByTokenUseCase(jwtAdapter, userRepository)
}
