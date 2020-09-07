import { CategoryModel } from '@/domain/models/category'

export interface CreateCategoryModel {
  name: string
  description?: string
  disabled: boolean
  user_id: number
}

export interface CreateCategory {
  create: (category: CreateCategoryModel) => Promise<CategoryModel>
}
