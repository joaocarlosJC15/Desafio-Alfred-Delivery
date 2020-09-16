
import { LaunchRepository } from './launch-repository'
import connection from '../config/connection'
import { CreateLaunchModel } from '@/domain/usecases/launch/create/protocols/create-launch'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'

const tableName = 'launchs'
const fakeDate = new Date(1998, 2, 11)

const makeFakeCreateLaunch = (): CreateLaunchModel => ({
  description: 'description',
  type: 'type',
  input: 1,
  output: 2,
  balance: 3,
  date: fakeDate,
  disabled: false,
  category_id: 0
})

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

describe('LaunchRepository', () => {
  beforeAll(async () => {
    await connection.migrate.latest()
  })

  beforeEach(async () => {
    await connection(tableName).del()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  const makeSut = (): LaunchRepository => {
    return new LaunchRepository()
  }

  describe('create()', () => {
    test('LaunchRepository.create deve retornar um lançamento se a acao for bem sucedida', async () => {
      const sut = makeSut()

      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id = user[0]

      const fakeCategory = Object.assign({}, makeFakeCreateCategory())
      fakeCategory.user_id = user_id

      const category = await connection('categories').insert(fakeCategory)
      const category_id = category[0]

      const fakeLaunch = Object.assign({}, makeFakeCreateLaunch())
      fakeLaunch.category_id = category_id

      const launch = await sut.create(fakeLaunch)

      expect(launch).toBeTruthy()
      expect(launch.id).toBeTruthy()
      expect(launch.description).toBe(makeFakeCreateLaunch().description)
      expect(launch.type).toBe(makeFakeCreateLaunch().type)
      expect(launch.input).toBe(makeFakeCreateLaunch().input)
      expect(launch.output).toBe(makeFakeCreateLaunch().output)
      expect(launch.balance).toBe(makeFakeCreateLaunch().balance)
      expect(launch.date).toStrictEqual(makeFakeCreateLaunch().date)
      expect(launch.category.id).toBe(category_id)
      expect(launch.category.name).toBe(makeFakeCreateCategory().name)
      expect(launch.category.description).toBe(makeFakeCreateCategory().description)
      expect(launch.category.user_id).toBe(user_id)
    })

    test('LaunchRepository.create deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'create').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.create(makeFakeCreateLaunch())

      await expect(error).rejects.toThrow()
    })
  })
})
