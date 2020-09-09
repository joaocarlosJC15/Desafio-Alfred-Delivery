import { EditCategory } from '@/domain/usecases/category/edit/protocols/edit-category'
import { CategoryRepository } from '@/infra/db/postgresql/category/category-repository'
import { EditCategoryUsecase } from '@/domain/usecases/category/edit/edit-category-usecase'

export const makeEditCategoryUseCase = (): EditCategory => {
  const categoryRepository = new CategoryRepository()

  const EditCategoryrUseCase = new EditCategoryUsecase(categoryRepository, categoryRepository)

  return EditCategoryrUseCase
}
