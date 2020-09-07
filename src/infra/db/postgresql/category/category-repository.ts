import { CreateCategoryRepository } from '@/domain/protocols/db/category/create-category-repository'
import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'
import { CategoryModel } from '@/domain/models/category'
import connection from '../config/connection'
import { serializeToCategory } from './category-serialize'

export class CategoryRepository implements CreateCategoryRepository {
  tableName = 'categories'

  async create (categoryCreate: CreateCategoryModel): Promise<CategoryModel> {
    const data = await connection(this.tableName).insert(categoryCreate).returning('*')

    if (data && data.length) {
      const id = Number(data[0]) ? data[0] : data[0].id

      const categoryData = await connection.select().from(this.tableName).where('categories.id', id)
      console.log(categoryData)
      if (categoryData) {
        console.log(serializeToCategory(categoryData[0]))
        return serializeToCategory(categoryData[0])
      }
    }

    return null
  }
}
