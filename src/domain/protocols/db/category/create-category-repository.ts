import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'
import { CategoryModel } from '@/domain/models/category'

export interface CreateCategoryRepository {
  create: (category: CreateCategoryModel) => Promise<CategoryModel>
}
