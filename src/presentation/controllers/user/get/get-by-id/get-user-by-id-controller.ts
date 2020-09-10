import { Controller, HttpResponse, HttpRequest, Validation } from '@/presentation/protocols'
import { convertErrorToHttpResponse, noContent, ok } from '@/presentation/http/responses'
import { GetUserByIdRepository } from '@/domain/protocols/db/user/get-user-by-id-repository'

export class GetUserByIdController implements Controller {
  constructor (
    private readonly getUserById: GetUserByIdRepository,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user_id = Number(httpRequest.params.user_id)
      const validateError = this.validation.validate({ user_id })
      if (validateError) {
        throw validateError
      }

      if (user_id !== httpRequest.user_id) {
        return noContent()
      }

      const user = await this.getUserById.getById(httpRequest.user_id)

      return user ? ok(user) : noContent()
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
