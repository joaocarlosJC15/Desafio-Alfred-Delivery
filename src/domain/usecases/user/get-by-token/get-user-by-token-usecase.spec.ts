import { GetUserByTokenUseCase } from './get-user-by-token-usecase'
import { Decrypter } from '@/domain/protocols/criptography/jwt/decrypter'
import { GetUserByTokenRepository } from '@/domain/protocols/db/user/get-user-by-token-repository'
import { UserModel } from '@/domain/models/user'
import { UnauthorizedError } from '@/errors'

interface SutTypes {
  sut: GetUserByTokenUseCase
  decrypterStub: Decrypter
  getUserByTokenRepositoryStub: GetUserByTokenRepository
}

const fakeDate = new Date()
const result = 'any_value'
const fakeToken = 'any_token'

const makeFakeUser = (): UserModel => ({
  id: 1,
  name: 'valid_name',
  email: 'valid_email@mail.com',
  birthDate: fakeDate,
  password: 'valid_password'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise <string> {
      return new Promise(resolve => resolve(result))
    }
  }

  return new DecrypterStub()
}

const makeGetUserByTokenRepository = (): GetUserByTokenRepository => {
  class GetUserByTokenRepositoryStub implements GetUserByTokenRepository {
    async getByToken (token: string): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new GetUserByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const getUserByTokenRepositoryStub = makeGetUserByTokenRepository()
  const sut = new GetUserByTokenUseCase(decrypterStub, getUserByTokenRepositoryStub)

  return {
    sut,
    decrypterStub,
    getUserByTokenRepositoryStub
  }
}

describe('GetUserByTokenUsecase', () => {
  test('GetUserByTokenUsecase.decrypter.decrypt deve ser chamado com o token', async () => {
    const { decrypterStub, sut } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.getByToken(fakeToken)

    expect(decryptSpy).toHaveBeenCalledWith(fakeToken)
  })

  test('GetUserByTokenUsecase deve retornar um erro do tipo "UnauthorizedError" se ecrypter.decrypt retornar null', async () => {
    const { decrypterStub, sut } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const error = sut.getByToken(fakeToken)

    await expect(error).rejects.toEqual(new UnauthorizedError())
  })

  test('GetUserByTokenUsecase deve retornar uma excecao se ecrypter.decrypt retornar uma excecao', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const error = sut.getByToken(fakeToken)

    await expect(error).rejects.toThrow()
  })

  test('GetUserByTokenUsecase.getUserByTokenRepository.getByToken deve ser chamado com o token', async () => {
    const { sut, getUserByTokenRepositoryStub } = makeSut()

    const getByTokenSpy = jest.spyOn(getUserByTokenRepositoryStub, 'getByToken')

    await sut.getByToken(fakeToken)

    expect(getByTokenSpy).toHaveBeenCalledWith(fakeToken)
  })

  test('GetUserByTokenUsecase.getByToken deve retornar um erro do tipo "UnauthorizedError" se getUserByTokenRepository.getByToken retornar null', async () => {
    const { sut, getUserByTokenRepositoryStub } = makeSut()

    jest.spyOn(getUserByTokenRepositoryStub, 'getByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const error = sut.getByToken(fakeToken)

    await expect(error).rejects.toEqual(new UnauthorizedError())
  })

  test('GetUserByTokenUsecase.getByToken deve retornar uma excecao se getUserByTokenRepository.getByToken retornar uma excecao', async () => {
    const { sut, getUserByTokenRepositoryStub } = makeSut()

    jest.spyOn(getUserByTokenRepositoryStub, 'getByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const error = sut.getByToken(fakeToken)

    await expect(error).rejects.toThrow()
  })

  test('GetUserByTokenUsecase.getByToken deve retornar um usuario para o caso de sucesso', async () => {
    const { sut } = makeSut()

    const account = await sut.getByToken(fakeToken)

    expect(account).toEqual(makeFakeUser())
  })
})
