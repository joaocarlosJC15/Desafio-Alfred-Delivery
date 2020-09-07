import { AuthenticationMiddleware } from './authentication-middleware'
import { UserModel } from '@/domain/models/user'
import { HttpRequest } from '../protocols'
import { convertErrorToHttpResponse, ok } from '../http/responses'
import { UnauthorizedError } from '@/errors'
import { GetUserByToken } from '@/domain/usecases/user/get-by-token/protocols/get-user-by-token'

interface SutTypes {
  sut: AuthenticationMiddleware
  getUserByTokenStub: GetUserByToken
}
const makeFakeDate = new Date()
const token = 'any_token'

const makeFakeUser = (): UserModel => ({
  id: 1,
  name: 'valid_name',
  birthDate: makeFakeDate,
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'access-token': token
  }
})

const makeGetUserByToken = (): GetUserByToken => {
  class GetUserByTokenStub implements GetUserByToken {
    async getByToken (token: string): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new GetUserByTokenStub()
}

const makeSut = (): SutTypes => {
  const getUserByTokenStub = makeGetUserByToken()
  const sut = new AuthenticationMiddleware(getUserByTokenStub)

  return {
    sut,
    getUserByTokenStub
  }
}

describe('AuthenticationMiddleware', () => {
  test('AuthenticationMiddleware.handle deve retornar 401 se não for fornecido um token', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new UnauthorizedError()))
  })

  test('AuthenticationMiddleware.getUserByToken.getByToken deve ser chamado com o token', async () => {
    const { sut, getUserByTokenStub } = makeSut()

    const loadSpy = jest.spyOn(getUserByTokenStub, 'getByToken')

    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith(token)
  })

  test('AuthenticationMiddleware.handle deve retornar 500 se getUserByToken.getByToken retornar uma excecao', async () => {
    const { sut, getUserByTokenStub } = makeSut()

    jest.spyOn(getUserByTokenStub, 'getByToken').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('AuthenticationMiddleware.handle deve retornar 401 se getUserByToken.getByToken retornar um erro do tipo "UnauthorizedError"', async () => {
    const { sut, getUserByTokenStub } = makeSut()

    jest.spyOn(getUserByTokenStub, 'getByToken').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new UnauthorizedError())
    }))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new UnauthorizedError()))
  })

  test('AuthenticationMiddleware.handle deve retornar 200 se o token for validado com sucesso', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ user_id: makeFakeUser().id }))
  })
})
