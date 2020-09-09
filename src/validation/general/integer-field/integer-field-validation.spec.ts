import { IntegerFieldValidation } from './integer-field-validation'
import { InvalidParamError } from '@/errors'

const makeSut = (): IntegerFieldValidation => {
  return new IntegerFieldValidation('field')
}

describe('IntegerFieldValidation', () => {
  test('RequiredFieldValidation.validate não deve retornar nada se a validação for bem sucedida', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 2 })
    expect(error).toBeUndefined()
  })

  test('IntegerFieldValidation.validate deve retonar o erro "InvalidParamError" se for a propriedade a ser testada for uma string', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'number' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('IntegerFieldValidation.validate deve retonar o erro "InvalidParamError" se for a propriedade a ser testada for um numero real', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 1.2 })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('IntegerFieldValidation.validate deve retonar o erro "InvalidParamError" se for a propriedade a ser testada for um objeto', () => {
    const sut = makeSut()
    const error = sut.validate({ field: {} })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('IntegerFieldValidation.validate deve retonar o erro "InvalidParamError" se for a propriedade a ser testada for um booleano', () => {
    const sut = makeSut()
    const error = sut.validate({ field: true })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('IntegerFieldValidation.validate deve retonar o erro "InvalidParamError" se for a propriedade a ser testada for um undefined', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new InvalidParamError('field'))
  })
})
