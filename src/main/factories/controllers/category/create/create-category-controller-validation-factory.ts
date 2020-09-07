import { Validation } from '@/presentation/protocols/validation'

import { RequiredFieldValidation, ValidationComposite } from '@/validation'

export const makeCreateCategoryControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('name'))

  return new ValidationComposite(validations)
}
