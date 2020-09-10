import { Controller } from '@/presentation/protocols'
import { GetUserByIdController } from '@/presentation/controllers/user/get/get-by-id/get-user-by-id-controller'
import { makeGetUserByIdUsecase } from '@/main/factories/usecases/user/get/get-user-by-id-usecase-factory'
import { makeGetUserByIdValidation } from './get-user-by-id-controller-factory-validation-factory'

export const makeGetUserByIdController = (): Controller => {
  const controller = new GetUserByIdController(makeGetUserByIdUsecase(), makeGetUserByIdValidation())

  return controller
}
