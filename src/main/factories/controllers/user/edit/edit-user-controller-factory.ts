import { Controller } from '@/presentation/protocols'
import { EditUserController } from '@/presentation/controllers/user/edit/edit-user-controller'
import { makeEditUserControllerValidation } from './edit-user-controller-validation-factory'
import { makeEditUserUsecase } from '@/main/factories/usecases/user/edit/edit-user-usecase-factory'

export const makeEditUserController = (): Controller => {
  const controller = new EditUserController(
    makeEditUserUsecase(),
    makeEditUserControllerValidation()
  )

  return controller
}
