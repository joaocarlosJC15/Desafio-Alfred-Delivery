import { GetCategoriesByUserUseCase } from '@/domain/usecases/category/get/get-all-by-user/get-categories-by-user-usecase'
import { makeCategoryRepository } from '@/main/factories/repositores/category/category-repository-factory'

export const makeGetCategoriesByUserUseCase = (): GetCategoriesByUserUseCase => {
  const getCategoriesByUserUseCase = new GetCategoriesByUserUseCase(makeCategoryRepository())

  return getCategoriesByUserUseCase
}
