import { CategoryModel } from '@/domain/models/category'
import { GetCategoryByUserUseCase } from './get-category-by-user-usecase'
import { GetCategoryByUserRepository } from '@/domain/protocols/db/category/get-category-by-user-repository'

interface SutTypes {
  sut: GetCategoryByUserUseCase
  getCategoryByUserRepositoryStub: GetCategoryByUserRepository
}

const fakeUserId = 1
const fakeCategoryId = 1

const makeFakeCategory = (): CategoryModel => ({
  id: 1,
  name: 'name',
  description: 'description',
  disabled: false,
  user_id: 1
})

const makeGetCategoryByUserRepository = (): GetCategoryByUserRepository => {
  class GetCategoryByUserRepositoryStub implements GetCategoryByUserRepository {
    async getByUser (user_id: number): Promise<CategoryModel> {
      return new Promise(resolve => resolve(makeFakeCategory()))
    }
  }

  return new GetCategoryByUserRepositoryStub()
}

const makeSut = (): SutTypes => {
  const getCategoryByUserRepositoryStub = makeGetCategoryByUserRepository()
  const sut = new GetCategoryByUserUseCase(getCategoryByUserRepositoryStub)

  return {
    sut,
    getCategoryByUserRepositoryStub
  }
}

describe('GetCategoryByUserUsecase', () => {
  test('GetCategoryByUserUseCase.getCategoryByUserRepository.getByUser deve ser chamado com os valores corretos', async () => {
    const { sut, getCategoryByUserRepositoryStub } = makeSut()

    const createCategorySpy = jest.spyOn(getCategoryByUserRepositoryStub, 'getByUser')

    await sut.getByUser(fakeCategoryId, fakeUserId)

    expect(createCategorySpy).toHaveBeenCalledWith(fakeUserId, fakeUserId)
  })

  test('CreateCategoryUseCase deve retornar uma excecao caso GetCategoryByUserRepository.getByUser gere uma excecao', async () => {
    const { sut, getCategoryByUserRepositoryStub } = makeSut()

    jest.spyOn(getCategoryByUserRepositoryStub, 'getByUser').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const error = sut.getByUser(fakeCategoryId, fakeUserId)

    await expect(error).rejects.toEqual(new Error())
  })

  test('GetCategoryByUserUseCase.getCategoryByUserRepository.getByUser deve retornar uma categoria para o caso de sucesso', async () => {
    const { sut } = makeSut()

    const category = await sut.getByUser(fakeCategoryId, fakeUserId)

    expect(category).toEqual(makeFakeCategory())
  })
})
