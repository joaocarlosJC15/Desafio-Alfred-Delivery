import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { CreateUser } from '@/domain/usecases/user/create-user'

export class CreateUserControler implements Controller {
  constructor (
    private readonly createUser: CreateUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, birthDate, password } = httpRequest.body

    await this.createUser.create({
      name,
      email,
      birthDate,
      password
    })

    return await new Promise(resolve => resolve(null))
  }
}
