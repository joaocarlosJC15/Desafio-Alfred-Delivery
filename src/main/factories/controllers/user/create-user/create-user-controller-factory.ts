import { Controller } from '@/presentation/protocols'
import { CreateUserControler } from '@/presentation/controllers/user/create/create-user-controller'
import { makeCreateUserUseCase } from '@/main/factories/usecases/user/create-user/create-user-usecase-factory'
import { makeCreateUserControllerValidation } from './create-user-controller-validation-factory'
import { makeAuthenticationUseCase } from '@/main/factories/usecases/user/authentication/authentication-usecase-factory'

export const makeCreateUserController = (): Controller => {
  const controller = new CreateUserControler(
    makeCreateUserUseCase(),
    makeCreateUserControllerValidation(),
    makeAuthenticationUseCase()
  )

  return controller
}
