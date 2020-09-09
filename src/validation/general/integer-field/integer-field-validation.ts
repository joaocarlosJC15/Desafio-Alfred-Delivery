import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/errors'

export class IntegerFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    if (!Number.isInteger(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
