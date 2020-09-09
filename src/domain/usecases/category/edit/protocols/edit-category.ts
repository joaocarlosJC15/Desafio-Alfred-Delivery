export interface EditCategoryModel {
  name?: string
  description?: string
  disabled?: boolean
}

export interface EditCategory {
  edit: (category: EditCategoryModel) => Promise<void>
}
