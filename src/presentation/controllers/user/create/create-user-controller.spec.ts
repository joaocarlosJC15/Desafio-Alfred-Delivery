import { HttpRequest, Validation } from '@/presentation/protocols'
import { CreateUserControler } from './create-user-controller'
import { CreateUser, CreateUserModel } from '@/domain/usecases/user/create-user'
import { UserModel } from '@/domain/models/user'
import { MissingParamError, InvalidParamError } from '@/errors'
import { badRequest } from '@/presentation/http/responses'

interface SutTypes {
  sut: CreateUserControler
  createUserStub: CreateUser
  validationStub: Validation
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const createUserStub = makeCreateUser()
  const validationStub = makeValidation()
  const sut = new CreateUserControler(createUserStub, validationStub)

  return {
    sut,
    createUserStub,
    validationStub
  }
}

describe('CreateUserController', () => {
  test('CreateUserController deve retornar 400 se alguma validação retornar o erro "MissingParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('field')))
  })

  test('CreateUserController deve retornar 400 se alguma validação retornar o erro "InvalidParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('field')))
  })

  test('CreateUserController deve retornar 400 se alguma validação retornar o erro "InvalidParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('field')))
  })

  test('CreateUserController.createUser.create deve ser chamado com os valores corretos', async () => {
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
