import { CategoryModel } from '@/domain/models/category'
import { GetCategoriesByUserUseCase } from './get-categories-by-user-usecase'
import { GetCategoriesByUserRepository } from '@/domain/protocols/db/category/get-categories-by-user-repository'

interface SutTypes {
  sut: GetCategoriesByUserUseCase
  getCategoriesByUserRepositoryStub: GetCategoriesByUserRepository
}

const fakeUserId = 1

const makeFakeCategories = (): CategoryModel[] => ([
  {
    id: 1,
    name: 'name',
    description: 'description',
    disabled: false,
    user_id: 1
  },
  {
    id: 1,
    name: 'name',
    description: 'description',
    disabled: false,
    user_id: 1
  },
  {
    id: 1,
    name: 'name',
    description: 'description',
    disabled: false,
    user_id: 1
  }
])

const makeGetCategoriesByUserRepository = (): GetCategoriesByUserRepository => {
  class GetCategoriesByUserRepositoryStub implements GetCategoriesByUserRepository {
    async getAllByUser (user_id: number): Promise<CategoryModel[]> {
      return new Promise(resolve => resolve(makeFakeCategories()))
    }
  }

  return new GetCategoriesByUserRepositoryStub()
}

const makeSut = (): SutTypes => {
  const getCategoriesByUserRepositoryStub = makeGetCategoriesByUserRepository()
  const sut = new GetCategoriesByUserUseCase(getCategoriesByUserRepositoryStub)

  return {
    sut,
    getCategoriesByUserRepositoryStub
  }
}

describe('GetCategoriesByUserUsecase', () => {
  test('GetCategoriesByUserUseCase.getCategoriesByUserRepository.getAllByUser deve ser chamado com o "user_id"', async () => {
    const { sut, getCategoriesByUserRepositoryStub } = makeSut()

    const createCategorySpy = jest.spyOn(getCategoriesByUserRepositoryStub, 'getAllByUser')

    await sut.getAllByUser(fakeUserId)

    expect(createCategorySpy).toHaveBeenCalledWith(fakeUserId)
  })

  test('CreateCategoryUseCase deve retornar uma excecao caso GetCategoriesByUserRepository.getAllByUser gere uma excecao', async () => {
    const { sut, getCategoriesByUserRepositoryStub } = makeSut()

    jest.spyOn(getCategoriesByUserRepositoryStub, 'getAllByUser').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.getAllByUser(fakeUserId)

    await expect(error).rejects.toEqual(new Error())
  })

  test('GetCategoriesByUserUseCase.getCategoriesByUserRepository.getAllByUser deve retornar um array de categorias para o caso de sucesso', async () => {
    const { sut } = makeSut()

    const category = await sut.getAllByUser(fakeUserId)

    expect(category).toEqual(makeFakeCategories())
  })
})
