import { EditCategory, EditCategoryModel } from './protocols/edit-category'
import { EditCategoryRepository } from '@/domain/protocols/db/category/edit-category-repository'
import { GetCategoryByUserRepository } from '@/domain/protocols/db/category/get-category-by-user-repository'

export class EditCategoryUsecase implements EditCategory {
  constructor (
    private readonly editCategoryRepository: EditCategoryRepository,
    private readonly getCategoryByUserRepository: GetCategoryByUserRepository
  ) {}

  async edit (user_id: number, editCategory: EditCategoryModel): Promise<boolean> {
    const category = await this.getCategoryByUserRepository.getByUser(editCategory.id, user_id)
    if (!category) {
      return false
    }

    await this.editCategoryRepository.edit(editCategory)

    return true
  }
}
