import { Controller } from '@/presentation/protocols'
import { GetCategoriesByUserController } from '@/presentation/controllers/category/get/get-all-by-user/get-categories-by-user-controller'
import { makeCategoryRepository } from '@/main/factories/repositories/category/category-repository-factory'

export const makeGetCategoriesByUserController = (): Controller => {
  const controller = new GetCategoriesByUserController(makeCategoryRepository())

  return controller
}
