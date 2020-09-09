import { CategoryModel } from '@/domain/models/category'
import { GetCategoriesByUserRepository } from '@/domain/protocols/db/category/get-categories-by-user-repository'
import { GetCategoriesByUser } from '../protocols/get-categories-by-user'

export class GetCategoriesByUserUseCase implements GetCategoriesByUser {
  constructor (
    private readonly getCategoriesByUserRepository: GetCategoriesByUserRepository
  ) { }

  async getAllByUser (user_id: number): Promise<CategoryModel[]> {
    const categories = this.getCategoriesByUserRepository.getAllByUser(user_id)

    return categories
  }
}
