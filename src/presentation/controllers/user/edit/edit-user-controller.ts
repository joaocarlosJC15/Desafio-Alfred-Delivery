import { Controller, HttpRequest, Validation, HttpResponse } from '@/presentation/protocols'
import { EditUser } from '@/domain/usecases/user/edit/protocols/edit-user'
import { convertErrorToHttpResponse, ok, noContent } from '@/presentation/http/responses'

export class EditUserController implements Controller {
  constructor (
    private readonly editUser: EditUser,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user_id = Number(httpRequest.params.user_id)
      const validateError = this.validation.validate(Object.assign({ user_id }, httpRequest.body))
      if (validateError) {
        throw (validateError)
      }

      if (user_id !== httpRequest.user_id) {
        return noContent()
      }

      const { name, email, birthDate, newPassword, password } = httpRequest.body

      const response = await this.editUser.edit(
        user_id, {
          name,
          email,
          birthDate,
          password: newPassword
        },
        password
      )

      if (response) {
        return ok({ message: 'Usuário editado com sucesso' })
      }

      return noContent()
    } catch (error) {
      return convertErrorToHttpResponse(error)
    }
  }
}
