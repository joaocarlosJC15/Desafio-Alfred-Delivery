import { GetCategoryByUserUseCase } from '@/domain/usecases/category/get/get-by-user/get-category-by-user-usecase'
import { makeCategoryRepository } from '@/main/factories/repositories/category/category-repository-factory'
import { GetCategoryByUser } from '@/domain/usecases/category/get/protocols/get-category-by-user'

export const makeGetCategoryByUserUseCase = (): GetCategoryByUser => {
  const getCategoryByUserUseCase = new GetCategoryByUserUseCase(makeCategoryRepository())

  return getCategoryByUserUseCase
}
