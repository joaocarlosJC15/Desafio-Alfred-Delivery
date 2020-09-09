import { CategoryRepository } from '@/infra/db/postgresql/category/category-repository'

export const makeCategoryRepository = (): CategoryRepository => {
  return new CategoryRepository()
}
