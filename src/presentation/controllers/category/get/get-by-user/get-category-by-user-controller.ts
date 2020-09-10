import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { GetCategoryByUser } from '@/domain/usecases/category/get/protocols/get-category-by-user'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'

export class GetCategoryByUserController implements Controller {
  constructor (
    private readonly getCategoryByUser: GetCategoryByUser,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const category_id = Number(httpRequest.params.category_id)
      const validateError = this.validation.validate({ category_id })
      if (validateError) {
        throw (validateError)
      }
      const user_id = httpRequest.user_id

      const category = await this.getCategoryByUser.getByUser(category_id, user_id)

      return category ? ok(category) : noContent()
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
