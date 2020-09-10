import { AuthenticationUserController } from './authentication-user-controller'
import { Authentication, AuthenticationModel } from '@/domain/usecases/user/authentication/protocols/authentication-user'
import { Validation, HttpRequest } from '@/presentation/protocols'
import { UnauthorizedError } from '@/errors/unauthorized-error'
import { ok, convertErrorToHttpResponse } from '@/presentation/http/responses'
import { MissingParamError, InvalidParamError } from '@/errors'

const token = 'any_token'

interface SutTypes {
  sut: AuthenticationUserController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve(token))
    }
  }

  return new AuthenticationStub()
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
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new AuthenticationUserController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('AuthenticationUserController.Authentication.auth deve ser chamado com os valores corretos', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: makeFakeRequest().body.email,
      password: makeFakeRequest().body.password
    })
  })

  test('AuthenticationUserController deve retornar 401 se Authentication.auth retornar um erro do tipo "UnauthorizedError"', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new UnauthorizedError()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new UnauthorizedError()))
  })

  test('AuthenticationUserController deve retornar 401 se Authentication.auth lancar alguma excecao', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('AuthenticationUserController deve retornar 200 se a autenticacao for feita com sucesso', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ jwtToken: 'any_token' }))
  })

  test('AuthenticationUserController.validation.validate deve ser chamado com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('AuthenticationUserController deve retornar 400 se alguma validação retornar o erro "MissingParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new MissingParamError('field')))
  })

  test('AuthenticationUserController deve retornar 400 se alguma validação retornar o erro "InvalidParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new InvalidParamError('field')))
  })
})
