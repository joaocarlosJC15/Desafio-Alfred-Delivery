import { Validation } from '@/presentation/protocols/validation'

import { RequiredFieldValidation, ValidationComposite, CompareFieldsValidation, DateFieldValidation } from '@/validation'
import { StringFieldValidation } from '@/validation/general/string-field/string-field-validation'

export const makeCreateUserControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'birthDate', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new StringFieldValidation('name', 200))
  validations.push(new DateFieldValidation('birthDate'))
  validations.push(new StringFieldValidation('email', 200))
  validations.push(new StringFieldValidation('password', 200))
  validations.push(new StringFieldValidation('passwordConfirmation', 200))

  return new ValidationComposite(validations)
}
