import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { CreateUser } from '@/domain/usecases/user/create/protocols/create-user'
import { convertErrorToHttpResponse, ok } from '@/presentation/http/responses'
import { Authentication } from '@/domain/usecases/user/authentication/protocols/authentication-user'

export class CreateUserControler implements Controller {
  constructor (
    private readonly createUser: CreateUser,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validateError = this.validation.validate(httpRequest.body)
      if (validateError) {
        throw validateError
      }

      const { name, email, birthDate, password } = httpRequest.body

      await this.createUser.create({
        name,
        email,
        birthDate,
        password
      })

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
