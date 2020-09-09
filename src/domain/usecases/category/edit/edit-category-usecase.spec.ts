import { EditCategoryUsecase } from './edit-category-usecase'
import { EditCategoryRepository } from '@/domain/protocols/db/category/edit-category-repository'
import { EditCategoryModel } from './protocols/edit-category'

interface SutTypes {
  sut: EditCategoryUsecase
  editCategoryRepositoryStub: EditCategoryRepository
}

const makeFakeEditCategoryModel = (): EditCategoryModel => ({
  name: 'name',
  description: 'description',
  disabled: false
})

const makeFakeEditCategoryRepository = (): EditCategoryRepository => {
  class EditCategoryRepositoryStub implements EditCategoryRepository {
    async edit (category: EditCategoryModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new EditCategoryRepositoryStub()
}

const makeSut = (): SutTypes => {
  const editCategoryRepositoryStub = makeFakeEditCategoryRepository()
  const sut = new EditCategoryUsecase(editCategoryRepositoryStub)

  return {
    sut,
    editCategoryRepositoryStub
  }
}

describe('EditCategoryUsecase', () => {
  test('EditCategoryUseCase.editCategoryRepository.edit deve ser chamado com os valores corretos', async () => {
    const { sut, editCategoryRepositoryStub } = makeSut()

    const editSpy = jest.spyOn(editCategoryRepositoryStub, 'edit')

    await sut.edit(makeFakeEditCategoryModel())

    expect(editSpy).toHaveBeenCalledWith(makeFakeEditCategoryModel())
  })

  test('EditCategoryUseCase deve retornar uma excecao se editCategoryRepository.edit gerar uma excecao', async () => {
    const { sut, editCategoryRepositoryStub } = makeSut()

    jest.spyOn(editCategoryRepositoryStub, 'edit').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.edit(makeFakeEditCategoryModel())

    await expect(error).rejects.toEqual(new Error())
  })

  test('EditCategoryUseCase.editCategoryRepository.edit não deve retornar nada se for bem sucedido', async () => {
    const { sut } = makeSut()

    const response = await sut.edit(makeFakeEditCategoryModel())

    expect(response).toBeUndefined()
  })
})
