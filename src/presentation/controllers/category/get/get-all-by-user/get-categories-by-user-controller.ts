import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { GetCategoriesByUser } from '@/domain/usecases/category/get/protocols/get-categories-by-user'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'

export class GetCategoriesByUserController implements Controller {
  constructor (
    private readonly getCategoriesByUser: GetCategoriesByUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user_id = httpRequest.user_id

      const categories = await this.getCategoriesByUser.getAllByUser(user_id)

      return categories ? ok(categories) : noContent()
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
