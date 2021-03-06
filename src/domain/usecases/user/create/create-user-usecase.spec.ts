
import { CreateUserRepository } from '@/domain/protocols/db/user/create-user-repository'
import { CreateUserUsecase } from './create-user-usecase'
import { HashGenerate } from '@/domain/protocols/criptography/hash/hash-generate'
import { UserModel } from '@/domain/models/user'
import { CreateUserModel } from './protocols/create-user'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'
import { ParamInUseError } from '@/errors'

interface SutTypes {
  sut: CreateUserUsecase
  hashGenerateStub: HashGenerate
  createUserRepositoryStub: CreateUserRepository
  getUserByEmailRepositoryStub: GetUserByEmailRepository
}

const hashPassword = 'hash'
const makeFakeDate = new Date()

const makeFakeUser = (): UserModel => ({
  id: 0,
  name: 'name',
  email: 'email@mail.com',
  birthDate: makeFakeDate,
  password: hashPassword
})

const makeFakeCreateUser = (): CreateUserModel => ({
  name: 'name',
  email: 'email@mail.com',
  birthDate: makeFakeDate,
  password: 'password'
})

const makeHashGenerate = (): HashGenerate => {
  class HashGenerateStub implements HashGenerate {
    async generate (value: string): Promise<string> {
      return new Promise(resolve => resolve(hashPassword))
    }
  }

  return new HashGenerateStub()
}

const makeCreateUserRepository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async create (user: CreateUserModel): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new CreateUserRepositoryStub()
}

const makeGetUserByEmailRepository = (): GetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
    async getByEmail (email: string): Promise<UserModel> {
      return new Promise(resolve => resolve(null))
    }
  }

  return new GetUserByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hashGenerateStub = makeHashGenerate()
  const createUserRepositoryStub = makeCreateUserRepository()
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepository()
  const sut = new CreateUserUsecase(createUserRepositoryStub, hashGenerateStub, getUserByEmailRepositoryStub)

  return {
    sut,
    hashGenerateStub,
    createUserRepositoryStub,
    getUserByEmailRepositoryStub
  }
}

describe('CreateUserUsecase', () => {
  test('CreateUserUsecase.hashGenerate.generate deve ser chamado com o campo password', async () => {
    const { sut, hashGenerateStub } = makeSut()

    const hashSpy = jest.spyOn(hashGenerateStub, 'generate')

    await sut.create(makeFakeCreateUser())

    expect(hashSpy).toHaveBeenCalledWith(makeFakeCreateUser().password)
  })

  test('CreateUserUseCase deve retornar uma excecao caso HashGenerate.generate gere uma excecao', async () => {
    const { sut, hashGenerateStub } = makeSut()

    jest.spyOn(hashGenerateStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const error = sut.create(makeFakeCreateUser())

    await expect(error).rejects.toEqual(new Error())
  })

  test('CreateUserUseCase.createUserRepository.create deve ser chamado com os valores corretos', async () => {
    const { sut, createUserRepositoryStub } = makeSut()

    const createUserSpy = jest.spyOn(createUserRepositoryStub, 'create')

    await sut.create(makeFakeCreateUser())

    expect(createUserSpy).toHaveBeenCalledWith({
      name: makeFakeCreateUser().name,
      email: makeFakeCreateUser().email,
      birthDate: makeFakeCreateUser().birthDate,
      password: hashPassword
    })
  })

  test('CreateUserUseCase deve retornar uma excecao caso CreateUserRepository.create gere uma excecao', async () => {
    const { sut, createUserRepositoryStub } = makeSut()

    jest.spyOn(createUserRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const error = sut.create(makeFakeCreateUser())

    await expect(error).rejects.toEqual(new Error())
  })

  test('CreateUserUseCase.getUserByEmailRepository.getByEmail deve ser chamado com o campo email', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    const getUserSpy = jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail')

    await sut.create(makeFakeCreateUser())

    expect(getUserSpy).toHaveBeenCalledWith(makeFakeCreateUser().email)
  })

  test('CreateUserUseCase deve retornar uma excecao caso GetUserByEmailRepository.getByEmail gere uma excecao', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const error = sut.create(makeFakeCreateUser())

    await expect(error).rejects.toEqual(new Error())
  })

  test('CreateUserUseCase deve retornar um erro do tipo "ParamInUseError" caso GetUserByEmailRepository.getByEmail retorne um usuario', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeUser())))

    const error = sut.create(makeFakeCreateUser())

    await expect(error).rejects.toEqual(new ParamInUseError('email'))
  })

  test('CreateUserUseCase deve retornar um usuario caso CreateUserRepository.create for bem sucedido', async () => {
    const { sut } = makeSut()

    const user = await sut.create(makeFakeCreateUser())

    expect(user).toEqual(makeFakeUser())
  })
})
