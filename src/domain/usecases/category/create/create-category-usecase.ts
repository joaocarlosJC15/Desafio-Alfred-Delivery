import { CreateCategory, CreateCategoryModel } from './protocols/create-category'
import { CreateCategoryRepository } from '@/domain/protocols/db/category/create-category-repository'
import { CategoryModel } from '@/domain/models/category'
import { InternalServerError } from '@/errors'

export class CreateCategoryUsecase implements CreateCategory {
  constructor (
    private readonly createCategoryRepository: CreateCategoryRepository
  ) {}

  async create (categoryCreate: CreateCategoryModel): Promise<CategoryModel> {
    const category = await this.createCategoryRepository.create(categoryCreate)

    if (!category) {
      throw new InternalServerError()
    }

    return category
  }
}
