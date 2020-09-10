import { Controller } from '@/presentation/protocols'
import { GetCategoriesByUserController } from '@/presentation/controllers/category/get/get-all-by-user/get-categories-by-user-controller'
import { makeGetCategoriesByUserUseCase } from '@/main/factories/usecases/category/get/get-categories-by-user-usecase-factory'

export const makeGetCategoriesByUserController = (): Controller => {
  const controller = new GetCategoriesByUserController(makeGetCategoriesByUserUseCase())

  return controller
}
