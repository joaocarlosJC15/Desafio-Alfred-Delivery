import { StringFieldValidation } from './string-field-validation'
import { InvalidParamError } from '@/errors'

const makeSut = (length?: number): StringFieldValidation => {
  return new StringFieldValidation('field', length)
}

describe('StringFieldValidation', () => {
  test('StringieldValidation.validate não deve retornar nada se a validação for bem sucedida', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'ab' })
    expect(error).toBeUndefined()
  })

  test('StringFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for uma string maior que o permitido', () => {
    const sut = makeSut(5)
    const error = sut.validate({ field: 'abcdef' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('StringFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for um numero', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 1 })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('StringFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for um objeto', () => {
    const sut = makeSut()
    const error = sut.validate({ field: {} })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('StringFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for um booleano', () => {
    const sut = makeSut()
    const error = sut.validate({ field: true })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('StringFieldValidation.validate deve retonar o erro "InvalidParamError" se a propriedade a ser testada for um undefined', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new InvalidParamError('field'))
  })
})
