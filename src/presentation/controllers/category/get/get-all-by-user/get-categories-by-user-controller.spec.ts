import { HttpRequest } from '@/presentation/protocols'
import { GetCategoriesByUserController } from './get-categories-by-user-controller'
import { CategoryModel } from '@/domain/models/category'
import { convertErrorToHttpResponse, ok } from '@/presentation/http/responses'
import { GetCategoriesByUser } from '@/domain/usecases/category/get/protocols/get-categories-by-user'

interface SutTypes {
  sut: GetCategoriesByUserController
  getCategoriesByUserStub: GetCategoriesByUser
}

const makeFakeRequest = (): HttpRequest => ({
  user_id: 1
})

const makeFakeCategories = (): CategoryModel[] => ([
  {
    id: 0,
    name: 'valid_name',
    description: 'description',
    disabled: false,
    user_id: 1
  },
  {
    id: 0,
    name: 'valid_name',
    description: 'description',
    disabled: false,
    user_id: 1
  }
])

const makeGetCategoriesByUser = (): GetCategoriesByUser => {
  class GetCategoriesByUserStub implements GetCategoriesByUser {
    async getAllByUser (user_id: number): Promise<CategoryModel[]> {
      return new Promise(resolve => resolve(makeFakeCategories()))
    }
  }

  return new GetCategoriesByUserStub()
}

const makeSut = (): SutTypes => {
  const getCategoriesByUserStub = makeGetCategoriesByUser()
  const sut = new GetCategoriesByUserController(getCategoriesByUserStub)

  return {
    sut,
    getCategoriesByUserStub
  }
}

describe('GetCategoriesByUserController', () => {
  test('GetCategoriesByUserController.getCategoriesByUser.getAllByUser deve ser chamado com o "user_id"', async () => {
    const { sut, getCategoriesByUserStub } = makeSut()

    const getCategoriesByUserSpy = jest.spyOn(getCategoriesByUserStub, 'getAllByUser')

    await sut.handle(makeFakeRequest())

    expect(getCategoriesByUserSpy).toHaveBeenCalledWith(makeFakeRequest().user_id)
  })

  test('CreateCategoryController deve retornar 500 se getCategoriesByUser.getAllByUser lançar uma exceção', async () => {
    const { sut, getCategoriesByUserStub } = makeSut()

    jest.spyOn(getCategoriesByUserStub, 'getAllByUser').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('CreateCategoryController deve retornar 200 se getCategoriesByUser.getAllByUser for bem sucedido', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeCategories()))
  })
})
