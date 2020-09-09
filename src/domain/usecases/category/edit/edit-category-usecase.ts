import { EditCategory, EditCategoryModel } from './protocols/edit-category'
import { EditCategoryRepository } from '@/domain/protocols/db/category/edit-category-repository'

export class EditCategoryUsecase implements EditCategory {
  constructor (
    private readonly editCategoryRepository: EditCategoryRepository
  ) {}

  async edit (category: EditCategoryModel): Promise<void> {
    await this.editCategoryRepository.edit(category)
  }
}
