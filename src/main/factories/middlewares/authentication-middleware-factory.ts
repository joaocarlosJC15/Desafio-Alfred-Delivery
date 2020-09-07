import { Middleware } from '@/presentation/protocols'
import { AuthenticationMiddleware } from '@/presentation/middlewares/authentication-middleware'
import { makeGetUserByTokenUsecase } from '../usecases/user/get-user-by-token/get-user-by-token-usecase-factory'

export const makeAuthenticationMiddleware = (): Middleware => {
  return new AuthenticationMiddleware(makeGetUserByTokenUsecase())
}
