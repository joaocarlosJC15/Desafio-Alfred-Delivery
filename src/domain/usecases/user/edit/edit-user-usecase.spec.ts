import { EditUserUseCase } from './edit-user-usecase'
import { GetUserByIdRepository } from '@/domain/protocols/db/user/get-user-by-id-repository'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'
import { EditUserRepository } from '@/domain/protocols/db/user/edit-user-repository'
import { HashComparer } from '@/domain/protocols/criptography/hash/hash-comparer'
import { EditUserModel } from './protocols/edit-user'
import { UserModel } from '@/domain/models/user'
import { UnauthorizedError, ParamInUseError } from '@/errors'

interface SutTypes {
  sut: EditUserUseCase
  editUserRepositoryStub: EditUserRepository
  getUserByIdRepositoryStub: GetUserByIdRepository
  getUserByEmailRepositoryStub: GetUserByEmailRepository
  hashComparerStub: HashComparer
}

const fakeDate = new Date()
const fakeUserId = -1
const fakePassWord = 'password'
const makeFakeEditUserModel = (): EditUserModel => ({
  name: 'name_edit',
  email: 'email_edit',
  birthDate: fakeDate,
  password: 'edit_password'
})

const makeFakeUser = (): UserModel => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@mail.com',
  birthDate: fakeDate,
  password: 'hash_password'
})

const makeFakeEditUserRepository = (): EditUserRepository => {
  class EditUserRepositoryStub implements EditUserRepository {
    async edit (user_id: number, user: EditUserModel): Promise<void> {
      return new Promise(resolve => resolve(undefined))
    }
  }

  return new EditUserRepositoryStub()
}

const makeGetUserByIdRepository = (): GetUserByIdRepository => {
  class GetUserByIdStub implements GetUserByIdRepository {
    async getById (user_id: number): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new GetUserByIdStub()
}

const makeGetUserByEmailRepository = (): GetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
    async getByEmail (email: string): Promise<UserModel> {
      return new Promise(resolve => resolve(null))
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

const makeSut = (): SutTypes => {
  const editUserRepositoryStub = makeFakeEditUserRepository()
  const getUserByIdRepositoryStub = makeGetUserByIdRepository()
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepository()
  const hashComparerStub = makeHashComparer()

  const sut = new EditUserUseCase(
    editUserRepositoryStub,
    getUserByIdRepositoryStub,
    getUserByEmailRepositoryStub,
    hashComparerStub
  )

  return {
    sut,
    editUserRepositoryStub,
    getUserByEmailRepositoryStub,
    getUserByIdRepositoryStub,
    hashComparerStub
  }
}

describe('EditUserUseCase', () => {
  test('EditUserUseCase.editUserRepository.edit deve ser chamado com os valores corretos', async () => {
    const { sut, editUserRepositoryStub } = makeSut()

    const editSpy = jest.spyOn(editUserRepositoryStub, 'edit')

    await sut.edit(fakeUserId, makeFakeEditUserModel())

    expect(editSpy).toHaveBeenCalledWith(fakeUserId, makeFakeEditUserModel())
  })

  test('EditUserUseCase deve retornar uma excecao se editUserRepository.edit gerar uma excecao', async () => {
    const { sut, editUserRepositoryStub } = makeSut()

    jest.spyOn(editUserRepositoryStub, 'edit').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.edit(fakeUserId, makeFakeEditUserModel())

    await expect(error).rejects.toEqual(new Error())
  })

  test('EditUserUseCase.getUserByIdRepository.getById deve ser chamado com os valores corretos', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    const editSpy = jest.spyOn(getUserByIdRepositoryStub, 'getById')

    await sut.edit(fakeUserId, makeFakeEditUserModel())

    expect(editSpy).toHaveBeenCalledWith(fakeUserId)
  })

  test('EditUserUseCase.getUserByIdRepository.getById não deve ser chamado se não for passado um password', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    const editSpy = jest.spyOn(getUserByIdRepositoryStub, 'getById')

    const fakeUser = makeFakeEditUserModel()
    fakeUser.password = ''

    await sut.edit(fakeUserId, fakeUser)

    expect(editSpy).not.toHaveBeenCalled()
  })

  test('EditUserUseCase deve retornar uma excecao se getUserByIdRepository.getById  gerar uma excecao', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, 'getById').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.edit(fakeUserId, makeFakeEditUserModel())

    await expect(error).rejects.toEqual(new Error())
  })

  test('EditUserUseCase.getUserByEmailRepository.getByEmail deve ser chamado com os valores corretos', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    const editSpy = jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail')

    await sut.edit(fakeUserId, makeFakeEditUserModel())

    expect(editSpy).toHaveBeenCalledWith(makeFakeEditUserModel().email)
  })

  test('EditUserUseCase.getUserByEmailRepository.getByEmail não deve ser chamado se não for fornecido um email', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    const editSpy = jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail')

    const fakeUser = makeFakeEditUserModel()
    fakeUser.email = ''

    await sut.edit(fakeUserId, fakeUser)

    expect(editSpy).not.toHaveBeenCalled()
  })

  test('EditUserUseCase deve retornar um erro do tipo ParamInUseError se o novo email fornecido estiver em uso', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new ParamInUseError('email')))
    )

    const error = sut.edit(fakeUserId, makeFakeEditUserModel(), fakePassWord)

    await expect(error).rejects.toEqual(new ParamInUseError('email'))
  })

  test('EditUserUseCase deve retornar uma excecao se getUserByEmailRepository.getByEmail gerar uma excecao', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.edit(fakeUserId, makeFakeEditUserModel())

    await expect(error).rejects.toEqual(new Error())
  })

  test('EditUserUseCase.hashComparer.compare deve ser chamado com os valores corretos', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.edit(fakeUserId, makeFakeEditUserModel(), fakePassWord)

    expect(compareSpy).toHaveBeenCalledWith(makeFakeUser().password, fakePassWord)
  })

  test('EditUserUseCase.hashComparer.compare não deve ser chamado se não for fornecido um password', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    const fakeUser = makeFakeEditUserModel()
    fakeUser.password = ''

    await sut.edit(fakeUserId, fakeUser, fakePassWord)

    expect(compareSpy).not.toHaveBeenCalled()
  })

  test('EditUserUseCase deve retornar uma excecao se hashComparer.compare gerar uma excecao', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.edit(fakeUserId, makeFakeEditUserModel(), fakePassWord)

    await expect(error).rejects.toThrow()
  })

  test('EditUserUseCase deve retornar um erro do tipo UnauthorizedError se a autenticacao for invalida', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new UnauthorizedError()))
    )

    const error = sut.edit(fakeUserId, makeFakeEditUserModel(), fakePassWord)

    await expect(error).rejects.toEqual(new UnauthorizedError())
  })

  test('EditUserUseCase.edit deve retornar true se for bem sucedido', async () => {
    const { sut } = makeSut()

    const response = await sut.edit(fakeUserId, makeFakeEditUserModel())

    expect(response).toBeTruthy()
  })
})
