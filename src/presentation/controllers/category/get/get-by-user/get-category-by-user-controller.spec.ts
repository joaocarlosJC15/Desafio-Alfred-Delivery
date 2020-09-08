import { HttpRequest } from '@/presentation/protocols'
import { GetCategoryByUserController } from './get-category-by-user-controller'
import { CategoryModel } from '@/domain/models/category'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'
import { GetCategoryByUser } from '@/domain/usecases/category/get/protocols/get-category-by-user'

interface SutTypes {
  sut: GetCategoryByUserController
  getCategoryByUserStub: GetCategoryByUser
}

const makeFakeRequest = (): HttpRequest => ({
  user_id: 1,
  params: {
    category_id: 1
  }
})

const makeFakeCategory = (): CategoryModel => ({
  id: 0,
  name: 'valid_name',
  description: 'description',
  disabled: false,
  user_id: 1
})

const makeGetCategoryByUser = (): GetCategoryByUser => {
  class GetCategoryByUserStub implements GetCategoryByUser {
    async getByUser (category_id: number, user_id: number): Promise<CategoryModel> {
      return new Promise(resolve => resolve(makeFakeCategory()))
    }
  }

  return new GetCategoryByUserStub()
}

const makeSut = (): SutTypes => {
  const getCategoryByUserStub = makeGetCategoryByUser()
  const sut = new GetCategoryByUserController(getCategoryByUserStub)

  return {
    sut,
    getCategoryByUserStub
  }
}

describe('GetCategoryByUserController', () => {
  test('GetCategoryByUserController.getCategoryByUser.getByUser deve ser chamado com os valores corretos', async () => {
    const { sut, getCategoryByUserStub } = makeSut()

    const getCategoryByUserSpy = jest.spyOn(getCategoryByUserStub, 'getByUser')

    await sut.handle(makeFakeRequest())

    expect(getCategoryByUserSpy).toHaveBeenCalledWith(makeFakeRequest().params.category_id, makeFakeRequest().user_id)
  })

  test('GetCategoryByUserController deve retornar 500 se getCategoryByUser.getAllByUser lançar uma exceção', async () => {
    const { sut, getCategoryByUserStub } = makeSut()

    jest.spyOn(getCategoryByUserStub, 'getByUser').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('GetCategoryByUserController deve retornar 204 se getCategoryByUser.getByUser não retornar nenhuma categoria', async () => {
    const { sut, getCategoryByUserStub } = makeSut()

    jest.spyOn(getCategoryByUserStub, 'getByUser').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(noContent())
  })

  test('GetCategoryByUserController deve retornar 200 se getCategoryByUser.getByUser for bem sucedido', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeCategory()))
  })
})
