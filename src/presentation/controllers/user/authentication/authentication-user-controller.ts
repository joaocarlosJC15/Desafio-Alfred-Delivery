import { ok, convertErrorToHttpResponse } from '@/presentation/http/responses'
import { Controller, Validation, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases/user/authentication/protocols/authentication-user'

export class AuthenticationUserController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const validateError = this.validation.validate(httpRequest.body)
      if (validateError) {
        throw validateError
      }

      const jwtToken = await this.authentication.auth({
        email,
        password
      })

      return ok({ jwtToken })
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
