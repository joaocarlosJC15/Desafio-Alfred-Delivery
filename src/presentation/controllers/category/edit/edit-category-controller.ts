import { Controller, HttpRequest, Validation, HttpResponse } from '@/presentation/protocols'
import { EditCategory } from '@/domain/usecases/category/edit/protocols/edit-category'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'

export class EditCategoryController implements Controller {
  constructor (
    private readonly editCategory: EditCategory,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const category_id = Number(httpRequest.params.category_id)
      const validateError = this.validation.validate(Object.assign({ category_id }, httpRequest.body))
      if (validateError) {
        throw (validateError)
      }

      const user_id = httpRequest.user_id
      const { name, description, disabled } = httpRequest.body

      const response = await this.editCategory.edit(user_id, {
        id: category_id,
        name,
        description,
        disabled
      })

      if (response) {
        return ok({ message: 'Categoria editada com sucesso' })
      }

      return noContent()
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
