
import { UserRepository } from './user-repository'
import connection from '../config/connection'
import { CreateUserModel } from '@/domain/usecases/user/create/create-user'

const tableName = 'users'
const fakeDate = new Date(1998, 2, 11)

const makeFakeCreateUser = (): CreateUserModel => ({
  name: 'name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'password'
})

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await connection.migrate.latest()
  })

  beforeEach(async () => {
    await connection(tableName).del()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  const makeSut = (): UserRepository => {
    return new UserRepository()
  }

  describe('create()', () => {
    test('UserRepository.create deve retornar um usuario se a acao for bem sucedida', async () => {
      const sut = makeSut()

      const user = await sut.create(makeFakeCreateUser())

      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe(makeFakeCreateUser().name)
      expect(user.email).toBe(makeFakeCreateUser().email)
      expect(user.birthDate).toBeTruthy()
      expect(user.password).toBe(makeFakeCreateUser().password)
    })

    test('UserRepository.create deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'create').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.create(makeFakeCreateUser())

      await expect(error).rejects.toThrow()
    })
  })

  describe('getByEmail()', () => {
    test('UserRepository.getByEmail deve retornar um usuario se a acao for bem sucedida', async () => {
      const sut = makeSut()

      await connection(tableName).insert(makeFakeCreateUser())

      const user = await sut.getByEmail(makeFakeCreateUser().email)

      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe(makeFakeCreateUser().name)
      expect(user.email).toBe(makeFakeCreateUser().email)
      expect(user.birthDate).toBeTruthy()
      expect(user.password).toBe(makeFakeCreateUser().password)
    })

    test('UserRepository.getByEmail deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'getByEmail').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.getByEmail(makeFakeCreateUser().email)

      await expect(error).rejects.toThrow()
    })
  })

  describe('getById()', () => {
    test('UserRepository.getById deve retornar um usuario se a acao for bem sucedida', async () => {
      const sut = makeSut()

      const data = await connection(tableName).insert(makeFakeCreateUser())

      const user = await sut.getById(data[0])

      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe(makeFakeCreateUser().name)
      expect(user.email).toBe(makeFakeCreateUser().email)
      expect(user.birthDate).toBeTruthy()
      expect(user.password).toBe(makeFakeCreateUser().password)
    })

    test('UserRepository.getById deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'getById').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.getById(0)

      await expect(error).rejects.toThrow()
    })
  })
})
