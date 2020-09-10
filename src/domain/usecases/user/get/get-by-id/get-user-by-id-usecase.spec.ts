import { GetUserByIdUseCase } from './get-user-by-id-usecase'
import { UserModel } from '@/domain/models/user'
import { GetUserByIdRepository } from '@/domain/protocols/db/user/get-user-by-id-repository'

interface SutTypes {
  sut: GetUserByIdUseCase
  getUserByIdRepositoryStub: GetUserByIdRepository
}

const fakeDate = new Date()
const fakeId = 1

const makeFakeUser = (): UserModel => ({
  id: 1,
  name: 'valid_name',
  email: 'valid_email@mail.com',
  birthDate: fakeDate,
  password: 'valid_password'
})

const makeGetUserByIdRepository = (): GetUserByIdRepository => {
  class GetUserByIdRepositoryStub implements GetUserByIdRepository {
    async getById (user_id: number): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new GetUserByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const getUserByIdRepositoryStub = makeGetUserByIdRepository()
  const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub)

  return {
    sut,
    getUserByIdRepositoryStub
  }
}

describe('GetUserByIdUsecase', () => {
  test('GetUserByIdUsecase.getUserByIdRepository.getById deve ser chamado com o user_id', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    const getByIdSpy = jest.spyOn(getUserByIdRepositoryStub, 'getById')

    await sut.getById(fakeId)

    expect(getByIdSpy).toHaveBeenCalledWith(fakeId)
  })

  test('GetUserByIdUsecase deve retornar uma excecao se getUserByIdRepository.getById gerar uma excecao', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, 'getById').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.getById(fakeId)

    await expect(error).rejects.toThrowError()
  })

  test('GetUserByIdUsecase.getUserByIdRepository.getById deve retornar um usuario para o caso de sucesso', async () => {
    const { sut } = makeSut()

    const account = await sut.getById(fakeId)

    expect(account).toEqual(makeFakeUser())
  })
})
