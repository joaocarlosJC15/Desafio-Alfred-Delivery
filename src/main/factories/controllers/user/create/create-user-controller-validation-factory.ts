import { Validation } from '@/presentation/protocols/validation'

import { RequiredFieldValidation, ValidationComposite, CompareFieldsValidation, DateFieldValidation } from '@/validation'

export const makeCreateUserControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'birthDate', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new DateFieldValidation('birthDate'))

  return new ValidationComposite(validations)
}
