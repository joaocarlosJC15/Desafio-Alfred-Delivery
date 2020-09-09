import { EditCategoryModel } from '@/domain/usecases/category/edit/protocols/edit-category'

export interface EditCategoryRepository {
  edit: (category: EditCategoryModel) => Promise<void>
}
