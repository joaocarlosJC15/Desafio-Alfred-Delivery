import { BooleanFieldValidation } from './boolean-field-validation'
import { InvalidParamError } from '@/errors'

const makeSut = (): BooleanFieldValidation => {
  return new BooleanFieldValidation('field')
}

describe('BooleanFieldValidation', () => {
  test('BooleanFieldValidation.validate não deve retornar nada se a propriedade fornecida for true', () => {
    const sut = makeSut()
    const error = sut.validate({ field: true })
    expect(error).toBeUndefined()
  })

  test('BooleanFieldValidation.validate não deve retornar nada se a propriedade fornecida for false', () => {
    const sut = makeSut()
    const error = sut.validate({ field: false })
    expect(error).toBeUndefined()
  })

  test('BooleanFieldValidation.validate  não deve retornar nada se a propriedade a ser testada for null', () => {
    const sut = makeSut()
    const error = sut.validate({ field: null })
    expect(error).toBeUndefined()
  })

  test('BooleanFieldValidation.validate  não deve retornar nada se a propriedade a ser testada for undefined', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toBeUndefined()
  })

  test('BooleanFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for uma string', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'number' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('BooleanFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for um numero', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 1 })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('BooleanFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for um objeto', () => {
    const sut = makeSut()
    const error = sut.validate({ field: {} })
    expect(error).toEqual(new InvalidParamError('field'))
  })
})
