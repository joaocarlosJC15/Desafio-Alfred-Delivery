import { Validation } from '@/presentation/protocols/validation'

import { ValidationComposite, CompareFieldsValidation, DateFieldValidation } from '@/validation'
import { StringFieldValidation } from '@/validation/general/string-field/string-field-validation'

export const makeEditUserControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new CompareFieldsValidation('newPassword', 'password'))
  validations.push(new StringFieldValidation('name', 200))
  validations.push(new DateFieldValidation('birthDate'))
  validations.push(new StringFieldValidation('email', 200))
  validations.push(new StringFieldValidation('password', 200))
  validations.push(new StringFieldValidation('newPassword', 200))

  return new ValidationComposite(validations)
}
