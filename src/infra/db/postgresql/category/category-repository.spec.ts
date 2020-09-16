
import { CategoryRepository } from './category-repository'
import connection from '../config/connection'
import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import { EditCategoryModel } from '@/domain/usecases/category/edit/protocols/edit-category'

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
  description: 'description',
  disabled: false,
  user_id: 0
})

const makeFakeEditCategory = (): EditCategoryModel => ({
  id: 0,
  name: 'edit_name',
  description: 'edit_email@mail.com',
  disabled: false
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

  describe('getByUser()', () => {
    test('CategoryRepository.getByUser deve retornar uma categoria se a acao for bem sucedida', async () => {
      const sut = makeSut()

      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id = user[0]

      const fakeCategory = Object.assign({}, makeFakeCreateCategory())
      fakeCategory.user_id = user_id

      const categoryrResponse = await connection(tableName).insert(fakeCategory)
      const category_id = categoryrResponse[0]

      const category = await sut.getByUser(category_id, user_id)

      expect(category).toBeTruthy()
      expect(category.id).toBeTruthy()
      expect(category.name).toBe(makeFakeCreateCategory().name)
      expect(category.description).toBe(makeFakeCreateCategory().description)
      expect(category.disabled).toBeFalsy()
      expect(category.user_id).toBe(user_id)
    })

    test('CategoryRepository.getByUser deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'getByUser').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.getByUser(0, 0)

      await expect(error).rejects.toThrow()
    })

    test('CategoryRepository.getByUser deve retorna null ao buscar uma categoria não pertencente ao usuario', async () => {
      const sut = makeSut()

      let user = await connection('users').insert(makeFakeCreateUser())
      let user_id = user[0]

      const fakeCategory = Object.assign({}, makeFakeCreateCategory())
      fakeCategory.user_id = user_id

      const categoryrResponse = await connection(tableName).insert(fakeCategory)
      const category_id = categoryrResponse[0]

      user = await connection('users').insert(makeFakeCreateUser())
      user_id = user[0]

      const category = await sut.getByUser(category_id, user_id)

      expect(category).toBeNull()
    })
  })

  describe('getAllByUser()', () => {
    test('CategoryRepository.getAllByUser deve retornar todas as categorias de um usuario se a acao for bem sucedida', async () => {
      const sut = makeSut()

      let user = await connection('users').insert(makeFakeCreateUser())
      let user_id = user[0]

      const fakeCategory = Object.assign({}, makeFakeCreateCategory())
      fakeCategory.user_id = user_id

      await connection(tableName).insert(fakeCategory)

      user = await connection('users').insert(makeFakeCreateUser())
      user_id = user[0]
      fakeCategory.user_id = user_id

      await connection(tableName).insert(fakeCategory)
      await connection(tableName).insert(fakeCategory)

      const categories = await sut.getAllByUser(user_id)

      expect(categories).toBeTruthy()
      expect(categories.length).toBe(2)
    })

    test('CategoryRepository.getAllByUser deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'getAllByUser').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.getAllByUser(0)

      await expect(error).rejects.toThrow()
    })
  })

  describe('edit()', () => {
    test('CategoryRepository.edit nao deve retornar nada para o caso de sucesso', async () => {
      const sut = makeSut()

      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id = user[0]

      const fakeCreateCategory = Object.assign({}, makeFakeCreateCategory())
      fakeCreateCategory.user_id = user_id

      const categoryResponse = await connection(tableName).insert(fakeCreateCategory)
      const category_id = categoryResponse[0]

      const fakeEditCategory = makeFakeEditCategory()
      fakeEditCategory.id = category_id

      const response = await sut.edit(fakeEditCategory)

      expect(response).toBeUndefined()
    })

    test('CategoryRepository.edit deve alterar os campos do registro no banco de dados', async () => {
      const sut = makeSut()

      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id = user[0]

      const fakeCreateCategory = Object.assign({}, makeFakeCreateCategory())
      fakeCreateCategory.user_id = user_id

      const categoryResponse = await connection(tableName).insert(fakeCreateCategory)
      const category_id = categoryResponse[0]

      const fakeEditCategory = makeFakeEditCategory()
      fakeEditCategory.id = category_id

      await sut.edit(fakeEditCategory)

      const fakeEditCategoryWithUserId = Object.assign({ user_id: user_id }, fakeEditCategory)

      const editedCategory = await connection()
        .select()
        .from(tableName)
        .where(`${tableName}.id`, category_id)

      editedCategory[0].disabled = Boolean(editedCategory[0].disabled)

      expect(editedCategory[0]).toEqual(fakeEditCategoryWithUserId)
    })

    test('CategoryRepository.edit deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'edit').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.edit(makeFakeEditCategory())

      await expect(error).rejects.toThrow()
    })
  })
})
