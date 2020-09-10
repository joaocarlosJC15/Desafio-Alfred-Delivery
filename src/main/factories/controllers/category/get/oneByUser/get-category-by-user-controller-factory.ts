import { Controller } from '@/presentation/protocols'
import { makeCategoryRepository } from '@/main/factories/repositories/category/category-repository-factory'
import { GetCategoryByUserController } from '@/presentation/controllers/category/get/get-by-user/get-category-by-user-controller'
import { makeGetCategoryByUserValidation } from './get-category-by-user-controller-validation-factory'

export const makeGetCategoryByUserController = (): Controller => {
  const controller = new GetCategoryByUserController(makeCategoryRepository(), makeGetCategoryByUserValidation())

  return controller
}
