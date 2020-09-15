import { Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/errors'

export class DateFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    if (input[this.fieldName]) {
      const date = new Date(input[this.fieldName])

      if (date.toString() !== 'Invalid Date') {
        return
      }
      return new InvalidParamError(this.fieldName)
    }
  }
}
