import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/errors'

export class IntegerFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly numberOfDigits?: number
  ) {}

  validate (input: any): Error {
    if (!Number.isInteger(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
    if (this.numberOfDigits) {
      const element = input[this.fieldName].toString()
      if (element.length > this.numberOfDigits) {
        return new InvalidParamError(this.fieldName)
      }
    }
  }
}
