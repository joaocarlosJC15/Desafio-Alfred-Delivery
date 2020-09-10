import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/errors'

export class BooleanFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== null && input[this.fieldName] !== undefined && typeof input[this.fieldName] !== 'boolean') {
      return new InvalidParamError(this.fieldName)
    }
  }
}
