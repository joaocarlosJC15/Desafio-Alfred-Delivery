import { UserModel } from '@/domain/models/user'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'
import { AuthenticationModel } from './protocols/authentication-user'
import { AuthenticationUseCase } from './authentication-usecase'
import { HashComparer } from '@/domain/protocols/criptography/hash/hash-comparer'
import { Encrypter } from '@/domain/protocols/criptography/jwt/encrypter'
import { UpdateJwtTokenRepository } from '@/domain/protocols/db/user/update-jwt-token-repository'
import { NotFoundError } from '@/errors'
import { UnauthorizedError } from '@/errors/unauthorized-error'

interface SutTypes {
  sut: AuthenticationUseCase
  getUserByEmailRepositoryStub: GetUserByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateJwtTokenRepositoryStub: UpdateJwtTokenRepository
}

const fakeDate = new Date()
const token = 'any_token'

const makeFakeUser = (): UserModel => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@mail.com',
  birthDate: fakeDate,
  password: 'hash_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeGetUserByEmailRepository = (): GetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
    async getByEmail (email: string): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new GetUserByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: number): Promise<string> {
      return new Promise(resolve => resolve(token))
    }
  }

  return new EncrypterStub()
}

const makeUpdateJwtTokenRepository = (): UpdateJwtTokenRepository => {
  class UpdateJwtTokenRepositoryStub implements UpdateJwtTokenRepository {
    async updateJwtToken (id: number, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateJwtTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateJwtTokenRepositoryStub = makeUpdateJwtTokenRepository()

  const sut = new AuthenticationUseCase(
    getUserByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateJwtTokenRepositoryStub
  )

  return {
    sut,
    getUserByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateJwtTokenRepositoryStub
  }
}

describe('DbAutentication UseCase', () => {
  test('AuthenticationUseCase.getUserByEmailRepositoryStub.getByEmail deve ser chamado com o campo email', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    const getSpy = jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail')

    await sut.auth(makeFakeAuthentication())

    expect(getSpy).toHaveBeenCalledWith(makeFakeAuthentication().email)
  })

  test('AuthenticationUseCase deve retornar uma excecao se getUserByEmailRepositoryStub.getByEmail gerar uma excecao', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow()
  })

  test('AuthenticationUseCase deve retornar um erro do tipo "NotFoundError" se o usuario não for encontrado', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockReturnValueOnce(null)

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toEqual(new NotFoundError('Usuário não encontrado. Email ou senha inválidos'))
  })

  test('AuthenticationUseCase.hashComparer.compare deve ser chamado com os valores corretos', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith(makeFakeAuthentication().email, makeFakeUser().password)
  })

  test('AuthenticationUseCase deve retornar uma excecao se hashComparer.compare gerar uma excecao', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow()
  })

  test('AuthenticationUseCase deve retornar um erro do tipo UnauthorizedError se a autenticacao for invalida', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new UnauthorizedError()))
    )

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toEqual(new UnauthorizedError())
  })

  test('AuthenticationUseCase.encrypter.encrypt deve ser chamado com o campo id', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthentication())

    expect(encryptSpy).toHaveBeenCalledWith(makeFakeUser().id)
  })

  test('AuthenticationUseCase deve retornar uma excecao se encrypter.encrypt gerar uma excecao', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow()
  })

  test('AuthenticationUseCase.updateJwtTokenRepository.updateJwtToken deve ser chamado com os valores corretos', async () => {
    const { sut, updateJwtTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateJwtTokenRepositoryStub, 'updateJwtToken')

    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith(makeFakeUser().id, token)
  })

  test('AuthenticationUseCase deve retornar uma excecao se updateJwtTokenRepository.updateJwtToken gerar uma excecao', async () => {
    const { sut, updateJwtTokenRepositoryStub } = makeSut()

    jest.spyOn(updateJwtTokenRepositoryStub, 'updateJwtToken').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow()
  })

  test('AuthenticationUseCase.auth deve retornar um token caso seja bem sucedido', async () => {
    const { sut } = makeSut()

    const acessToken = await sut.auth(makeFakeAuthentication())

    expect(acessToken).toBe(token)
  })
})
