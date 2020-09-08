import { CategoryModel } from '@/domain/models/category'
import { GetCategoryByUser } from '../protocols/get-category-by-user'
import { GetCategoryByUserRepository } from '@/domain/protocols/db/category/get-category-by-user-repository'

export class GetCategoryByUserUseCase implements GetCategoryByUser {
  constructor (
    private readonly getCategoryByUserRepository: GetCategoryByUserRepository
  ) { }

  async getByUser (category_id: number, user_id: number): Promise<CategoryModel> {
    const category = this.getCategoryByUserRepository.getByUser(category_id, user_id)

    return category
  }
}
