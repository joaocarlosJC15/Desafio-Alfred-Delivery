import { GetCategoriesByUserUseCase } from '@/domain/usecases/category/get/get-all-by-user/get-categories-by-user-usecase'
import { makeCategoryRepository } from '@/main/factories/repositories/category/category-repository-factory'
import { GetCategoriesByUser } from '@/domain/usecases/category/get/protocols/get-categories-by-user'

export const makeGetCategoriesByUserUseCase = (): GetCategoriesByUser => {
  const getCategoriesByUserUseCase = new GetCategoriesByUserUseCase(makeCategoryRepository())

  return getCategoriesByUserUseCase
}
