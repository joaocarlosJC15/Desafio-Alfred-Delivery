import { HttpRequest, Validation } from '@/presentation/protocols'
import { CreateUserControler } from './create-user-controller'
import { CreateUser, CreateUserModel } from '@/domain/usecases/user/create/create-user'
import { MissingParamError, InvalidParamError, ParamInUseError } from '@/errors'
import { badRequest, serverError, ok, conflict } from '@/presentation/http/responses'
import { UserModel } from '@/domain/models/user'

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
      return new Promise(resolve => resolve(makeFakeUser()))
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
  test('CreateUserController.validation.validate deve ser chamado com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

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

  test('CreateUserController deve retornar 500 se CreateUserController.createUser.create lançar uma exceção', async () => {
    const { sut, createUserStub } = makeSut()

    jest.spyOn(createUserStub, 'create').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('CreateUserController deve retornar 409 se CreateUserController.createUser.create retornar o erro "ParamInUseError"', async () => {
    const { sut, createUserStub } = makeSut()

    jest.spyOn(createUserStub, 'create').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new ParamInUseError('email')))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(conflict(new ParamInUseError('email')))
  })

  test('CreateUserController deve retornar 200 se createUserController.createUser.create for bem sucedido', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeUser()))
  })
})
