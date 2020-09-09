import { Controller } from '@/presentation/protocols'
import { makeEditCategoryControllerValidation } from './edit-category-controller-validation-factory'
import { EditCategoryController } from '@/presentation/controllers/category/edit/edit-category-controller'
import { makeEditCategoryUseCase } from '@/main/factories/usecases/category/edit/edit-category-usecase-factory'

export const makeEditCategoryController = (): Controller => {
  const controller = new EditCategoryController(
    makeEditCategoryUseCase(),
    makeEditCategoryControllerValidation()
  )

  return controller
}
