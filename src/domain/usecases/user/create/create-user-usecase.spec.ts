
import { CreateUserRepository } from '@/domain/protocols/db/user/create-user-repository'
import { CreateUserUsecase } from './create-user-usecase'
import { HashGenerate } from '@/domain/protocols/criptography/hash/hash-generate'
import { UserModel } from '@/domain/models/user'
import { CreateUserModel } from './create-user'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'

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
  password: 'password'
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
      return new Promise(resolve => resolve(makeFakeUser()))
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

describe('DbAddAccount Usecase', () => {
  test('CreareUserUsecase.hashGenerate.generate deve ser chamado com o campo password', async () => {
    const { sut, hashGenerateStub } = makeSut()

    const hashSpy = jest.spyOn(hashGenerateStub, 'generate')

    await sut.create(makeFakeCreateUser())

    expect(hashSpy).toHaveBeenCalledWith(makeFakeCreateUser().password)
  })
})
