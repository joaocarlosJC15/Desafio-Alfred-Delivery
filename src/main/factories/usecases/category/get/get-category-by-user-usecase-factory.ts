import { GetCategoryByUserUseCase } from '@/domain/usecases/category/get/get-by-user/get-category-by-user-usecase'
import { makeCategoryRepository } from '@/main/factories/repositories/category/category-repository-factory'

export const makeGetCategoryByUserUseCase = (): GetCategoryByUserUseCase => {
  const getCategoryByUserUseCase = new GetCategoryByUserUseCase(makeCategoryRepository())

  return getCategoryByUserUseCase
}
