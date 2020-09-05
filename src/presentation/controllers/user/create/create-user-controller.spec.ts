import { HttpRequest } from '@/presentation/protocols'
import { CreateUserControler } from './create-user-controller'
import { CreateUser, CreateUserModel } from '@/domain/usecases/user/create-user'
import { UserModel } from '@/domain/models/user'

interface SutTypes {
  sut: CreateUserControler
  createUserStub: CreateUser
}

const makeFakeDate = new Date()

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    birthDate: makeFakeDate.toISOString(),
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeUser = (): UserModel => ({
  id: 0,
  name: 'valid_name',
  birthDate: makeFakeDate,
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeCreateUser = (): CreateUser => {
  class CreateUserStub implements CreateUser {
    async create (user: CreateUserModel): Promise<UserModel> {
      return await new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new CreateUserStub()
}

const makeSut = (): SutTypes => {
  const createUserStub = makeCreateUser()
  const sut = new CreateUserControler(createUserStub)

  return {
    sut,
    createUserStub
  }
}

describe('CreateUserController', () => {
  test('CreateUser.create deve ser chamado com os valores corretos', async () => {
    const { sut, createUserStub } = makeSut()

    const createUserSpy = jest.spyOn(createUserStub, 'create')

    await sut.handle(makeFakeRequest())

    expect(createUserSpy).toHaveBeenCalledWith({
      name: makeFakeRequest().body.name,
      email: makeFakeRequest().body.email,
      birthDate: makeFakeRequest().body.birthDate,
      password: makeFakeRequest().body.password
    })
  })
})
