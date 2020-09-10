import { HttpRequest, Validation } from '@/presentation/protocols'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'
import { InvalidParamError } from '@/errors'
import { GetUserByIdController } from './get-user-by-id-controller'
import { GetUserById } from '@/domain/usecases/user/get/get-by-id/protocols/get-user-by-id'
import { UserModel } from '@/domain/models/user'

interface SutTypes {
  sut: GetUserByIdController
  getUserByIdStub: GetUserById
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  user_id: 1,
  params: {
    user_id: '1'
  }
})

const fakeDate = new Date()
const makeFakeUser = (): UserModel => ({
  id: 0,
  name: 'valid_name',
  email: 'email@email.com',
  password: '',
  birthDate: fakeDate
})

const makeGetUserById = (): GetUserById => {
  class GetUserByIdStub implements GetUserById {
    async getById (user_id: number): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new GetUserByIdStub()
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
  const getUserByIdStub = makeGetUserById()
  const validationStub = makeValidation()
  const sut = new GetUserByIdController(getUserByIdStub, validationStub)

  return {
    sut,
    getUserByIdStub,
    validationStub
  }
}

describe('GetUserByIdRepository', () => {
  test('GetUserByIdRepository.validation.validate deve ser chamado com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    const user_id = Number(makeFakeRequest().params.user_id)

    const element = Object.assign({ user_id })

    expect(validateSpy).toHaveBeenCalledWith(element)
  })

  test('GetUserByIdRepository deve retornar 400 se alguma validação retornar o erro "InvalidParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new InvalidParamError('field')))
  })

  test('GetUserByIdRepository.getUserById.getById deve ser chamado com os valores corretos', async () => {
    const { sut, getUserByIdStub } = makeSut()

    const getCategoryByUserSpy = jest.spyOn(getUserByIdStub, 'getById')

    await sut.handle(makeFakeRequest())

    expect(getCategoryByUserSpy).toHaveBeenCalledWith(makeFakeRequest().user_id)
  })

  test('GetUserByIdRepository deve retornar 500 se getUserById.getById lançar uma exceção', async () => {
    const { sut, getUserByIdStub } = makeSut()

    jest.spyOn(getUserByIdStub, 'getById').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('GetUserByIdRepository deve retornar 204 se getUserById.getById não retornar nenhuma categoria', async () => {
    const { sut, getUserByIdStub } = makeSut()

    jest.spyOn(getUserByIdStub, 'getById').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(noContent())
  })

  test('GetUserByIdRepository deve retornar 200 se getUserById.getById for bem sucedido', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeUser()))
  })
})
