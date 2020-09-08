import { Controller } from '@/presentation/protocols'
import { makeCreateCategoryControllerValidation } from './create-category-controller-validation-factory'
import { CreateCategoryControler } from '@/presentation/controllers/category/create/create-category-controller'
import { makeCreateCategoryUseCase } from '@/main/factories/usecases/category/create/create-category-usecase-factory'

export const makeCreateCategoryController = (): Controller => {
  const controller = new CreateCategoryControler(
    makeCreateCategoryUseCase(),
    makeCreateCategoryControllerValidation()
  )

  return controller
}
