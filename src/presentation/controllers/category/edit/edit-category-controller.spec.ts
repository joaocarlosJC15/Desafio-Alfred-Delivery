import { HttpRequest, Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/errors'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'
import { EditCategoryController } from './edit-category-controller'
import { EditCategory, EditCategoryModel } from '@/domain/usecases/category/edit/protocols/edit-category'

interface SutTypes {
  sut: EditCategoryController
  editCategoryStub: EditCategory
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  user_id: 1,
  body: {
    name: 'name',
    description: 'description',
    disabled: false
  },
  params: {
    category_id: '1'
  }
})

const makeEditCategory = (): EditCategory => {
  class EditCategoryStub implements EditCategory {
    async edit (user_id: number, category: EditCategoryModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new EditCategoryStub()
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
  const editCategoryStub = makeEditCategory()
  const validationStub = makeValidation()
  const sut = new EditCategoryController(editCategoryStub, validationStub)

  return {
    sut,
    editCategoryStub,
    validationStub
  }
}

describe('EditCategoryController', () => {
  test('EditCategoryController.validation.validate deve ser chamado com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    const copyParams = Object.assign({}, makeFakeRequest().params)
    copyParams.category_id = Number(copyParams.category_id)

    const element = Object.assign(copyParams, makeFakeRequest().body)

    expect(validateSpy).toHaveBeenCalledWith(element)
  })

  test('EditCategoryController deve retornar 400 se alguma validação retornar o erro "InvalidParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new InvalidParamError('field')))
  })

  test('EditCategoryController.editCategory.edit deve ser chamado com os valores corretos', async () => {
    const { sut, editCategoryStub } = makeSut()

    const editCategorySpy = jest.spyOn(editCategoryStub, 'edit')

    await sut.handle(makeFakeRequest())

    const category_id = Number(makeFakeRequest().params.category_id)
    const element = Object.assign({ id: category_id }, makeFakeRequest().body)

    expect(editCategorySpy).toHaveBeenCalledWith(makeFakeRequest().user_id, element)
  })

  test('EditCategoryController deve retornar 500 se editCategory.edit lançar uma exceção', async () => {
    const { sut, editCategoryStub } = makeSut()

    jest.spyOn(editCategoryStub, 'edit').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('EditCategoryController deve retornar 204 se não for encontrada a categoria a ser editada', async () => {
    const { sut, editCategoryStub } = makeSut()

    jest.spyOn(editCategoryStub, 'edit').mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(noContent())
  })

  test('EditCategoryController deve retornar 200 se editCategory.edit for bem sucedido', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ message: 'Categoria editada com sucesso' }))
  })
})
