import { EditCategoryUsecase } from './edit-category-usecase'
import { EditCategoryRepository } from '@/domain/protocols/db/category/edit-category-repository'
import { EditCategoryModel } from './protocols/edit-category'
import { GetCategoryByUserRepository } from '@/domain/protocols/db/category/get-category-by-user-repository'
import { CategoryModel } from '@/domain/models/category'

interface SutTypes {
  sut: EditCategoryUsecase
  editCategoryRepositoryStub: EditCategoryRepository
  getCategoryByUserRepositoryStub: GetCategoryByUserRepository
}

const fakeUserId = 1
const makeFakeEditCategoryModel = (): EditCategoryModel => ({
  id: 1,
  name: 'name',
  description: 'description',
  disabled: false
})

const makeFakeEditModel = (): CategoryModel => ({
  id: 1,
  name: 'name',
  description: 'description',
  disabled: false,
  user_id: fakeUserId
})

const makeFakeEditCategoryRepository = (): EditCategoryRepository => {
  class EditCategoryRepositoryStub implements EditCategoryRepository {
    async edit (category: EditCategoryModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new EditCategoryRepositoryStub()
}

const makeFakeGetCategoryByUserRepository = (): GetCategoryByUserRepository => {
  class GetCategoryByUserRepositoryStub implements GetCategoryByUserRepository {
    async getByUser (category_id: number, user_id: number): Promise<CategoryModel> {
      return new Promise(resolve => resolve(makeFakeEditModel()))
    }
  }

  return new GetCategoryByUserRepositoryStub()
}

const makeSut = (): SutTypes => {
  const editCategoryRepositoryStub = makeFakeEditCategoryRepository()
  const getCategoryByUserRepositoryStub = makeFakeGetCategoryByUserRepository()
  const sut = new EditCategoryUsecase(editCategoryRepositoryStub, getCategoryByUserRepositoryStub)

  return {
    sut,
    editCategoryRepositoryStub,
    getCategoryByUserRepositoryStub
  }
}

describe('EditCategoryUsecase', () => {
  test('EditCategoryUseCase.editCategoryRepository.edit deve ser chamado com os valores corretos', async () => {
    const { sut, editCategoryRepositoryStub } = makeSut()

    const editSpy = jest.spyOn(editCategoryRepositoryStub, 'edit')

    await sut.edit(fakeUserId, makeFakeEditCategoryModel())

    expect(editSpy).toHaveBeenCalledWith(makeFakeEditCategoryModel())
  })

  test('EditCategoryUseCase deve retornar uma excecao se editCategoryRepository.edit gerar uma excecao', async () => {
    const { sut, editCategoryRepositoryStub } = makeSut()

    jest.spyOn(editCategoryRepositoryStub, 'edit').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.edit(fakeUserId, makeFakeEditCategoryModel())

    await expect(error).rejects.toEqual(new Error())
  })

  test('EditCategoryUseCase.editCategoryRepository.edit não deve retornar true se for bem sucedido', async () => {
    const { sut } = makeSut()

    const response = await sut.edit(fakeUserId, makeFakeEditCategoryModel())

    expect(response).toBeTruthy()
  })

  test('EditCategoryUseCase.getCategoryByUserRepository.getByUser deve ser chamado com os valores corretos', async () => {
    const { sut, getCategoryByUserRepositoryStub } = makeSut()

    const getByUserSpy = jest.spyOn(getCategoryByUserRepositoryStub, 'getByUser')

    await sut.edit(fakeUserId, makeFakeEditCategoryModel())

    expect(getByUserSpy).toHaveBeenCalledWith(makeFakeEditCategoryModel().id, fakeUserId)
  })

  test('EditCategoryUseCase deve retornar uma excecao se getCategoryByUserRepository.getByUser gerar uma excecao', async () => {
    const { sut, getCategoryByUserRepositoryStub } = makeSut()

    jest.spyOn(getCategoryByUserRepositoryStub, 'getByUser').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.edit(fakeUserId, makeFakeEditCategoryModel())

    await expect(error).rejects.toEqual(new Error())
  })

  test('EditCategoryUseCase.editCategoryRepository.edit deve retornar false se nao for encontrado um categoria', async () => {
    const { sut, getCategoryByUserRepositoryStub } = makeSut()

    jest.spyOn(getCategoryByUserRepositoryStub, 'getByUser').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )

    const response = await sut.edit(fakeUserId, makeFakeEditCategoryModel())

    expect(response).toBeFalsy()
  })
})
