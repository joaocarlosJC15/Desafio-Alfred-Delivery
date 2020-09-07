
import { UnauthorizedError } from '@/errors'
import { Middleware, HttpResponse, HttpRequest } from '../protocols'
import { GetUserByToken } from '@/domain/usecases/user/get-by-token/protocols/get-user-by-token'
import { convertErrorToHttpResponse, ok } from '../http/responses'

export class AuthenticationMiddleware implements Middleware {
  constructor (
    private readonly getUserByToken: GetUserByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['access-token']
      if (accessToken) {
        const user = await this.getUserByToken.getByToken(accessToken)

        return ok({ userId: user.id })
      }

      throw new UnauthorizedError()
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
