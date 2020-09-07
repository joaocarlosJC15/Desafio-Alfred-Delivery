import { CreateCategoryRepository } from '@/domain/protocols/db/category/create-category-repository'
import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'
import { CategoryModel } from '@/domain/models/category'
import connection from '../config/connection'
import { serializeToCategory } from './category-serialize'
import { GetCategoryByUserRepository } from '@/domain/protocols/db/category/get-category-by-user-repository'
import { GetCategoriesByUserRepository } from '@/domain/protocols/db/category/get-categories-by-user-repository'

export class CategoryRepository implements CreateCategoryRepository, GetCategoryByUserRepository, GetCategoriesByUserRepository {
  tableName = 'categories'

  async create (categoryCreate: CreateCategoryModel): Promise<CategoryModel> {
    const data = await connection(this.tableName).insert(categoryCreate).returning('*')

    if (data && data.length) {
      const id = Number(data[0]) ? data[0] : data[0].id

      const categoryData = await connection.select().from(this.tableName).where('categories.id', id)

      if (categoryData) {
        return serializeToCategory(categoryData[0])
      }
    }

    return null
  }

  async getByUser (category_id: number, user_id: number): Promise<CategoryModel> {
    const data = await connection
      .select()
      .from(this.tableName)
      .where('categories.id', category_id)
      .where('categories.user_id', user_id)

    if (data && data.length) {
      return serializeToCategory(data[0])
    }

    return null
  }

  async getAllByUser (user_id: number): Promise<CategoryModel[]> {
    const data = await connection
      .select()
      .from(this.tableName)
      .where('categories.user_id', user_id)

    if (data && data.length) {
      const categories: CategoryModel[] = []

      for (const element of data) {
        categories.push(serializeToCategory(element))
      }

      return categories
    }

    return null
  }
}
