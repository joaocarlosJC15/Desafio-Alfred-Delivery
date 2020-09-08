import { CategoryModel } from '@/domain/models/category'

export interface GetCategoriesByUser {
  getAllByUser(user_id: number): Promise<CategoryModel[]>
}
