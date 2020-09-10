import { HttpRequest, Validation } from '@/presentation/protocols'
import { GetCategoryByUserController } from './get-category-by-user-controller'
import { CategoryModel } from '@/domain/models/category'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'
import { GetCategoryByUser } from '@/domain/usecases/category/get/protocols/get-category-by-user'
import { InvalidParamError } from '@/errors'

interface SutTypes {
  sut: GetCategoryByUserController
  getCategoryByUserStub: GetCategoryByUser
  validationStub: Validation
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const getCategoryByUserStub = makeGetCategoryByUser()
  const validationStub = makeValidation()
  const sut = new GetCategoryByUserController(getCategoryByUserStub, validationStub)

  return {
    sut,
    getCategoryByUserStub,
    validationStub
  }
}

describe('GetCategoryByUserController', () => {
  test('GetCategoryByUserController.validation.validate deve ser chamado com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    const copyParams = Object.assign({}, makeFakeRequest().params)
    copyParams.category_id = Number(copyParams.category_id)

    const element = Object.assign(copyParams, makeFakeRequest().body)

    expect(validateSpy).toHaveBeenCalledWith(element)
  })

  test('GetCategoryByUserController deve retornar 400 se alguma validação retornar o erro "InvalidParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new InvalidParamError('field')))
  })

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
