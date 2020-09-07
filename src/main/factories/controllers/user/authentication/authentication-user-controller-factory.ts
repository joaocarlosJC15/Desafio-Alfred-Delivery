import { Controller } from '@/presentation/protocols'
import { AuthenticationUserController } from '@/presentation/controllers/user/authentication/authentication-user-controller'
import { makeAuthenticationUseCase } from '@/main/factories/usecases/user/authentication/authentication-usecase-factory'
import { makeAuthenticationUserControllerValidation } from './authentication-user-controller-validation-factory'

export const makeAuthenticationUserController = (): Controller => {
  const controller = new AuthenticationUserController(makeAuthenticationUseCase(), makeAuthenticationUserControllerValidation())

  return controller
}
