import { DateFieldValidation } from './date-field-validation'
import { InvalidParamError } from '@/errors'

const makeSut = (): DateFieldValidation => {
  return new DateFieldValidation('field')
}

describe('DateFieldValidation', () => {
  test('DateFieldValidation.validate deve retonar o erro "InvalidParamError" se a validação falhar', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'invalid_date' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('RequiredFieldValidation.validate não deve retornar nada se a validação for bem sucedida', () => {
    const sut = makeSut()
    const error = sut.validate({ field: '1998-11-03T00:00:00.000Z' })
    expect(error).toBeFalsy()
  })
})
