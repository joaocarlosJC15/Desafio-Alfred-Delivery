import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '@/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFieldsValidation', () => {
  test('CompareFieldsValidation.validate deve retonar o erro "InvalidParamError" se a validação falhar', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any',
      fieldToCompare: 'value_error'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('CompareFieldsValidation.validate não deve retornar nada se o primeiro campo a ser comparado for null', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: null,
      fieldToCompare: 'any'
    })
    expect(error).toBeFalsy()
  })

  test('CompareFieldsValidation.validate não deve retornar nada se a validação for bem sucedida', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any',
      fieldToCompare: 'any'
    })
    expect(error).toBeFalsy()
  })
})
