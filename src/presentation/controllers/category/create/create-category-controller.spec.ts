import { HttpRequest, Validation } from '@/presentation/protocols'
import { CreateCategoryControler } from './create-category-controller'
import { CreateCategory, CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'
import { CategoryModel } from '@/domain/models/category'
import { MissingParamError } from '@/errors'
import { convertErrorToHttpResponse, ok } from '@/presentation/http/responses'

interface SutTypes {
  sut: CreateCategoryControler
  createCategoryStub: CreateCategory
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  user_id: 1,
  body: {
    name: 'any_name',
    description: 'description'
  }
})

const makeFakeCategory = (): CategoryModel => ({
  id: 0,
  name: 'valid_name',
  description: 'description',
  disabled: false,
  user_id: 1
})

const makeCreateCategory = (): CreateCategory => {
  class CreateCategoryStub implements CreateCategory {
    async create (category: CreateCategoryModel): Promise<CategoryModel> {
      return new Promise(resolve => resolve(makeFakeCategory()))
    }
  }

  return new CreateCategoryStub()
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
  const createCategoryStub = makeCreateCategory()
  const validationStub = makeValidation()
  const sut = new CreateCategoryControler(createCategoryStub, validationStub)

  return {
    sut,
    createCategoryStub,
    validationStub
  }
}

describe('CreateCategoryController', () => {
  test('CreateCategoryController.validation.validate deve ser chamado com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('CreateCategoryController deve retornar 400 se alguma validação retornar o erro "MissingParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new MissingParamError('field')))
  })

  test('CreateCategoryController.createCategory.create deve ser chamado com os valores corretos', async () => {
    const { sut, createCategoryStub } = makeSut()

    const createCategorySpy = jest.spyOn(createCategoryStub, 'create')

    await sut.handle(makeFakeRequest())

    expect(createCategorySpy).toHaveBeenCalledWith({
      name: makeFakeRequest().body.name,
      description: makeFakeRequest().body.description,
      disabled: false,
      user_id: makeFakeRequest().user_id
    })
  })

  test('CreateCategoryController deve retornar 500 se createCategory.create lançar uma exceção', async () => {
    const { sut, createCategoryStub } = makeSut()

    jest.spyOn(createCategoryStub, 'create').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('CreateCategoryController deve retornar 200 se createCategory.create for bem sucedido', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeCategory()))
  })
})
