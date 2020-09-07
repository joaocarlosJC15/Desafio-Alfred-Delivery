import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { convertErrorToHttpResponse, ok } from '@/presentation/http/responses'
import { CreateCategory } from '@/domain/usecases/category/create/protocols/create-category'

export class CreateCategoryControler implements Controller {
  constructor (
    private readonly createCategory: CreateCategory,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validateError = this.validation.validate(httpRequest.body)
      if (validateError) {
        throw validateError
      }

      const user_id = httpRequest.user_id
      const { name, description } = httpRequest.body

      const category = await this.createCategory.create({
        name,
        description,
        disabled: false,
        user_id
      })

      return ok(category)
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
