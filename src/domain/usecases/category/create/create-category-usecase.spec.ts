import { CreateCategoryUsecase } from './create-category-usecase'
import { CreateCategoryRepository } from '@/domain/protocols/db/category/create-category-repository'
import { CategoryModel } from '@/domain/models/category'
import { CreateCategoryModel } from './protocols/create-category'

interface SutTypes {
  sut: CreateCategoryUsecase
  createCategoryRepositoryStub: CreateCategoryRepository
}

const makeFakeCategory = (): CategoryModel => ({
  id: 1,
  name: 'name',
  description: 'description',
  disabled: false,
  user_id: 1
})

const makeFakeCreateCategory = (): CreateCategoryModel => ({
  name: 'name',
  description: 'description',
  disabled: false,
  user_id: 1
})

const makeCreateCategoryRepository = (): CreateCategoryRepository => {
  class CreateCategoryRepositoryStub implements CreateCategoryRepository {
    async create (category: CreateCategoryModel): Promise<CategoryModel> {
      return new Promise(resolve => resolve(makeFakeCategory()))
    }
  }

  return new CreateCategoryRepositoryStub()
}

const makeSut = (): SutTypes => {
  const createCategoryRepositoryStub = makeCreateCategoryRepository()
  const sut = new CreateCategoryUsecase(createCategoryRepositoryStub)

  return {
    sut,
    createCategoryRepositoryStub
  }
}

describe('CreateCategoryUsecase', () => {
  test('CreateCategoryUseCase.createCategoryRepository.create deve ser chamado com os valores corretos', async () => {
    const { sut, createCategoryRepositoryStub } = makeSut()

    const createCategorySpy = jest.spyOn(createCategoryRepositoryStub, 'create')

    await sut.create(makeFakeCreateCategory())

    expect(createCategorySpy).toHaveBeenCalledWith({
      name: makeFakeCreateCategory().name,
      description: makeFakeCreateCategory().description,
      disabled: makeFakeCreateCategory().disabled,
      user_id: makeFakeCreateCategory().user_id
    })
  })

  test('CreateCategoryUseCase deve retornar uma excecao caso CreateCategoryRepository.create gere uma excecao', async () => {
    const { sut, createCategoryRepositoryStub } = makeSut()

    jest.spyOn(createCategoryRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const error = sut.create(makeFakeCreateCategory())

    await expect(error).rejects.toEqual(new Error())
  })

  test('CreateCategoryUseCase.createCategoryRepository.create deve retornar uma categoria para o caso de sucesso', async () => {
    const { sut } = makeSut()

    const category = await sut.create(makeFakeCreateCategory())

    expect(category).toEqual(makeFakeCategory())
  })
})
