import { Validation } from '@/presentation/protocols/validation'

import { RequiredFieldValidation, ValidationComposite, StringFieldValidation } from '@/validation'

export const makeCreateCategoryControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('name'))
  validations.push(new StringFieldValidation('name', 200))
  validations.push(new StringFieldValidation('description', 200))

  return new ValidationComposite(validations)
}
