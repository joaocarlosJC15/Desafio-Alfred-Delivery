import { CreateCategory } from '@/domain/usecases/category/create/protocols/create-category'
import { CategoryRepository } from '@/infra/db/postgresql/category/category-repository'
import { CreateCategoryUsecase } from '@/domain/usecases/category/create/create-category-usecase'

export const makeCreateCategoryUseCase = (): CreateCategory => {
  const categoryRepository = new CategoryRepository()

  const createCategoryrUseCase = new CreateCategoryUsecase(categoryRepository)

  return createCategoryrUseCase
}
