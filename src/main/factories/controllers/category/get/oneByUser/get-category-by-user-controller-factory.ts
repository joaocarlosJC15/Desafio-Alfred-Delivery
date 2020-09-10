import { Controller } from '@/presentation/protocols'
import { GetCategoryByUserController } from '@/presentation/controllers/category/get/get-by-user/get-category-by-user-controller'
import { makeGetCategoryByUserValidation } from './get-category-by-user-controller-validation-factory'
import { makeGetCategoryByUserUseCase } from '@/main/factories/usecases/category/get/get-category-by-user-usecase-factory'

export const makeGetCategoryByUserController = (): Controller => {
  const controller = new GetCategoryByUserController(makeGetCategoryByUserUseCase(), makeGetCategoryByUserValidation())

  return controller
}
