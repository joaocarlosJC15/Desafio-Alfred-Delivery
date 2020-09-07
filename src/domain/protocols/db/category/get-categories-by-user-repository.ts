import { CategoryModel } from '@/domain/models/category'

export interface GetCategoriesByUserRepository {
  getAllByUser: (user_id: number) => Promise<CategoryModel[]>
}
