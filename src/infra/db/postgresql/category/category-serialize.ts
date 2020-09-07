import { CategoryModel } from '@/domain/models/category'

export const serializeToCategory = (data: any): CategoryModel => {
  return {
    id: data.categories_id ? data.categories_id : data.id,
    name: data.categories_name ? data.categories_name : data.name,
    description: data.categories_description ? data.categories_description : data.description,
    disabled: data.categories_disabled ? Boolean(data.categories_disabled) : Boolean(data.disabled),
    user_id: data.categories_user_id ? data.categories_user_id : data.user_id
  }
}
