export interface EditCategoryModel {
  id: number
  name?: string
  description?: string
  disabled?: boolean
}

export interface EditCategory {
  edit: (user_id: number, category: EditCategoryModel) => Promise<boolean>
}
