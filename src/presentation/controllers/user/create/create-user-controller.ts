import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { CreateUser } from '@/domain/usecases/user/create/create-user'
import { convertErrorToHttpResponse, ok } from '@/presentation/http/responses'

export class CreateUserControler implements Controller {
  constructor (
    private readonly createUser: CreateUser,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validateError = this.validation.validate(httpRequest.body)
      if (validateError) {
        throw validateError
      }

      const { name, email, birthDate, password } = httpRequest.body

      const user = await this.createUser.create({
        name,
        email,
        birthDate,
        password
      })

      return ok(user)
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
