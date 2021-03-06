import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/errors'

export class StringFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly length?: number
  ) {}

  validate (input: any): Error {
    if (input[this.fieldName] && typeof input[this.fieldName] !== 'string') {
      return new InvalidParamError(this.fieldName)
    }
    if (input[this.fieldName] && this.length) {
      if (input[this.fieldName].length > this.length) {
        return new InvalidParamError(this.fieldName)
      }
    }
  }
}
