import { Validation } from '@/presentation/protocols/validation'

import { ValidationComposite, IntegerFieldValidation } from '@/validation'

export const makeGetCategoryByUserValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new IntegerFieldValidation('category_id', 9))

  return new ValidationComposite(validations)
}
