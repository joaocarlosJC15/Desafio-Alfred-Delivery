
import { CategoryRepository } from './category-repository'
import connection from '../config/connection'
import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'

const tableName = 'categories'

const fakeDate = new Date()
const makeFakeCreateUser = (): CreateUserModel => ({
  name: 'name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'password'
})

const makeFakeCreateCategory = (): CreateCategoryModel => ({
  name: 'name',
  description: 'email@mail.com',
  disabled: false,
  user_id: 0
})

describe('CategoryRepository', () => {
  beforeAll(async () => {
    await connection.migrate.latest()
  })

  beforeEach(async () => {
    await connection(tableName).del()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  const makeSut = (): CategoryRepository => {
    return new CategoryRepository()
  }

  describe('create()', () => {
    test('CategoryRepository.create deve retornar uma categoria se a acao for bem sucedida', async () => {
      const sut = makeSut()

      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id = user[0]

      const fakeCategory = Object.assign({}, makeFakeCreateCategory())
      fakeCategory.user_id = user_id

      const category = await sut.create(fakeCategory)

      expect(category).toBeTruthy()
      expect(category.id).toBeTruthy()
      expect(category.name).toBe(makeFakeCreateCategory().name)
      expect(category.description).toBe(makeFakeCreateCategory().description)
      expect(category.disabled).toBeFalsy()
      expect(category.user_id).toBe(user_id)
    })

    test('CategoryRepository.create deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'create').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.create(makeFakeCreateCategory())

      await expect(error).rejects.toThrow()
    })
  })
})
