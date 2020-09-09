import { Validation } from '@/presentation/protocols/validation'

import { ValidationComposite, IntegerFieldValidation, StringFieldValidation, BooleanFieldValidation } from '@/validation'

export const makeEditCategoryControllerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new IntegerFieldValidation('category_id', 9))
  validations.push(new StringFieldValidation('name', 200))
  validations.push(new StringFieldValidation('description', 200))
  validations.push(new BooleanFieldValidation('disabled'))

  return new ValidationComposite(validations)
}
