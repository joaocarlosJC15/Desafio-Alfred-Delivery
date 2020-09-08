import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { GetCategoryByUser } from '@/domain/usecases/category/get/protocols/get-category-by-user'
import { convertErrorToHttpResponse, ok } from '@/presentation/http/responses'

export class GetCategoryByUserController implements Controller {
  constructor (
    private readonly getCategoryByUser: GetCategoryByUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user_id = httpRequest.user_id
      const { category_id } = httpRequest.params

      const category = await this.getCategoryByUser.getByUser(category_id, user_id)

      return ok(category)
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
