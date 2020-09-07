import { CategoryModel } from '@/domain/models/category'

export interface GetCategoryByUserRepository {
  getByUser: (category_id: number, user_id: number) => Promise<CategoryModel>
}
