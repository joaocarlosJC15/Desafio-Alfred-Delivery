import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite, StringFieldValidation } from '@/validation'

export const makeAuthenticationUserControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new StringFieldValidation('email', 200))
  validations.push(new StringFieldValidation('password', 200))

  return new ValidationComposite(validations)
}
