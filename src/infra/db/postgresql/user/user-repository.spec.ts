
import { UserRepository } from './user-repository'
import connection from '../config/connection'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import { UserModel } from '@/domain/models/user'
import { EditUserModel } from '@/domain/usecases/user/edit/protocols/edit-user'

const tableName = 'users'
const fakeDate = new Date(1998, 2, 11)
const token = 'any_token'

const makeFakeCreateUser = (): CreateUserModel => ({
  name: 'name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'password'
})

describe('UserRepository', () => {
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

  describe('getAll()', () => {
    test('UserRepository.getAll deve retornar array de usuarios se a acao for bem sucedida', async () => {
      const sut = makeSut()

      await connection(tableName).insert(makeFakeCreateUser())
      await connection(tableName).insert(makeFakeCreateUser())

      const users = await sut.getAll()

      expect(users).toBeTruthy()
      expect(users.length).toBe(2)

      expect(users[0].id).toBeTruthy()
      expect(users[0].name).toBe(makeFakeCreateUser().name)
      expect(users[0].email).toBe(makeFakeCreateUser().email)
      expect(users[0].birthDate).toBeTruthy()
      expect(users[0].password).toBe(makeFakeCreateUser().password)

      expect(users[1].id).toBeTruthy()
      expect(users[1].name).toBe(makeFakeCreateUser().name)
      expect(users[1].email).toBe(makeFakeCreateUser().email)
      expect(users[1].birthDate).toBeTruthy()
      expect(users[1].password).toBe(makeFakeCreateUser().password)
    })

    test('UserRepository.getAll deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'getAll').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.getAll()

      await expect(error).rejects.toThrow()
    })
  })

  describe('edit()', () => {
    test('UserRepository.edit não deve retornar nada se a acao for bem sucedida', async () => {
      const sut = makeSut()

      const data = await connection(tableName).insert(makeFakeCreateUser())

      const editUser: EditUserModel = {
        name: 'name_edit',
        email: makeFakeCreateUser().email,
        birthDate: makeFakeCreateUser().birthDate,
        password: makeFakeCreateUser().password
      }

      const response = await sut.edit(data[0], editUser)

      expect(response).toBeUndefined()
    })

    test('UserRepository.edit deve atualizar somente os campos name e email do usuario no banco de dados', async () => {
      const sut = makeSut()

      const data = await connection(tableName).insert(makeFakeCreateUser())

      const editUser: EditUserModel = {
        name: 'name_edit',
        email: '123@mail.com',
        birthDate: null,
        password: null
      }

      await sut.edit(data[0], editUser)

      const result = await connection.select().from(tableName).where('users.id', data[0])

      expect(result).toBeTruthy()
      expect(result[0].id).toBeTruthy()
      expect(result[0].name).toBe(editUser.name)
      expect(result[0].email).toBe(editUser.email)
      expect(result[0].birthDate).toBeTruthy()
      expect(result[0].password).toBe(makeFakeCreateUser().password)
    })

    test('UserRepository.edit deve atualizar somente o campo senha do usuario no banco de dados', async () => {
      const sut = makeSut()

      const data = await connection(tableName).insert(makeFakeCreateUser())

      const editUser: EditUserModel = {
        name: '',
        email: '',
        birthDate: null,
        password: '123'
      }

      await sut.edit(data[0], editUser)

      const result = await connection.select().from(tableName).where('users.id', data[0])

      expect(result).toBeTruthy()
      expect(result[0].id).toBeTruthy()
      expect(result[0].name).toBe(makeFakeCreateUser().name)
      expect(result[0].email).toBe(makeFakeCreateUser().email)
      expect(result[0].birthDate).toBeTruthy()
      expect(result[0].password).toBe(editUser.password)
    })

    test('UserRepository.edit deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      const editUser: UserModel = {
        id: 0,
        name: 'name_edit',
        email: makeFakeCreateUser().email,
        birthDate: makeFakeCreateUser().birthDate,
        password: makeFakeCreateUser().password
      }

      jest.spyOn(sut, 'edit').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.edit(1, editUser)

      await expect(error).rejects.toThrow()
    })
  })

  describe('updateJwtToken()', () => {
    test('UserRepository.updateJwtToken armazenar no banco o token correto do usuario', async () => {
      const sut = makeSut()

      const data = await connection(tableName).insert(makeFakeCreateUser())

      await sut.updateJwtToken(data[0], token)

      const user = await connection.select().from(tableName).where('users.token', token)

      expect(user).toBeTruthy()
      expect(user[0].id).toBeTruthy()
      expect(user[0].name).toBe(makeFakeCreateUser().name)
      expect(user[0].email).toBe(makeFakeCreateUser().email)
      expect(user[0].birthDate).toBeTruthy()
      expect(user[0].password).toBe(makeFakeCreateUser().password)
    })

    test('UserRepository.updateJwtToken deve retornar uma excecao caso uma excecao seja gerada', async () => {
      const sut = makeSut()

      jest.spyOn(sut, 'updateJwtToken').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const error = sut.updateJwtToken(0, token)

      await expect(error).rejects.toThrow()
    })
  })

  describe('getByToken()', () => {
    test('UserRepository.getByToken deve retornar um usuario se a acao for bem sucedida', async () => {
      const sut = makeSut()

      const data = await connection(tableName).insert(makeFakeCreateUser())

      await sut.updateJwtToken(data[0], token)

      const user = await sut.getByToken(token)

      expect(user).toBeTruthy()
      expect(user.id).toBeTruthy()
      expect(user.name).toBe(makeFakeCreateUser().name)
      expect(user.email).toBe(makeFakeCreateUser().email)
      expect(user.birthDate).toBeTruthy()
      expect(user.password).toBe(makeFakeCreateUser().password)
    })
  })

  test('UserRepository.getByToken deve retornar uma excecao caso uma excecao seja gerada', async () => {
    const sut = makeSut()

    jest.spyOn(sut, 'getByToken').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const error = sut.getByToken(token)

    await expect(error).rejects.toThrow()
  })
})
