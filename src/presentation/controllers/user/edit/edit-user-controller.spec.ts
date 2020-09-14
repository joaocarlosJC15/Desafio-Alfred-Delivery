import { HttpRequest, Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/errors'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'
import { EditUserController } from './edit-user-controller'
import { EditUser, EditUserModel } from '@/domain/usecases/user/edit/protocols/edit-user'

interface SutTypes {
  sut: EditUserController
  editUserStub: EditUser
  validationStub: Validation
}

const fakeDate = new Date()
const makeFakeRequest = (): HttpRequest => ({
  user_id: 1,
  body: {
    name: 'name',
    email: 'email@email.com',
    birthDate: fakeDate,
    password: 'password',
    newPassword: 'new_password'
  },
  params: {
    user_id: '1'
  }
})

const makeEditUser = (): EditUser => {
  class EditUserStub implements EditUser {
    async edit (user_id: number, user: EditUserModel, password?: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new EditUserStub()
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
  const editUserStub = makeEditUser()
  const validationStub = makeValidation()
  const sut = new EditUserController(editUserStub, validationStub)

  return {
    sut,
    editUserStub,
    validationStub
  }
}

describe('EditUserController', () => {
  test('EditUserController.validation.validate deve ser chamado com os valores corretos', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(makeFakeRequest())

    const copyParams = Object.assign({}, makeFakeRequest().params)
    copyParams.user_id = Number(copyParams.user_id)

    const element = Object.assign(copyParams, makeFakeRequest().body)

    expect(validateSpy).toHaveBeenCalledWith(element)
  })

  test('EditUserController deve retornar 400 se alguma validação retornar o erro "InvalidParamError"', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new InvalidParamError('field')))
  })

  test('EditUserController.editUser.edit deve ser chamado com os valores corretos', async () => {
    const { sut, editUserStub } = makeSut()

    const editUserSpy = jest.spyOn(editUserStub, 'edit')

    await sut.handle(makeFakeRequest())

    const user_id = Number(makeFakeRequest().params.user_id)

    const { name, email, birthDate, newPassword } = makeFakeRequest().body

    expect(editUserSpy).toHaveBeenCalledWith(
      user_id,
      {
        name,
        email,
        birthDate,
        password: newPassword
      },
      makeFakeRequest().body.password)
  })

  test('EditUserController deve retornar 500 se editUser.edit lançar uma exceção', async () => {
    const { sut, editUserStub } = makeSut()

    jest.spyOn(editUserStub, 'edit').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(convertErrorToHttpResponse(new Error()))
  })

  test('EditUserController deve retornar 204 se editUser.edit retornar false', async () => {
    const { sut, editUserStub } = makeSut()

    jest.spyOn(editUserStub, 'edit').mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(noContent())
  })

  test('EditUserController deve retornar 200 se editUser.edit for bem sucedido', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ message: 'Usuário editado com sucesso' }))
  })
})
