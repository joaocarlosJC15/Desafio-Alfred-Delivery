import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '@/errors'
import { Validation } from '@/presentation/protocols'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
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
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('ValidationComposite.validate deve retornar um erro se uma validação falhar', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[1], 'validate').mockReturnValue(new MissingParamError('field'))

    const error = sut.validate({ field: 'any' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
