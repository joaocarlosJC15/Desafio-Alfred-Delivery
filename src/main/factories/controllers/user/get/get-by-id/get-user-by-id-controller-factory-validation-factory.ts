import { Validation } from '@/presentation/protocols/validation'

import { ValidationComposite, IntegerFieldValidation } from '@/validation'

export const makeGetUserByIdValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new IntegerFieldValidation('user_id', 9))

  return new ValidationComposite(validations)
}
