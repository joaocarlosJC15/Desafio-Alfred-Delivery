import { EditUser, EditUserModel } from './protocols/edit-user'
import { EditUserRepository } from '@/domain/protocols/db/user/edit-user-repository'
import { GetUserByIdRepository } from '@/domain/protocols/db/user/get-user-by-id-repository'
import { HashComparer } from '@/domain/protocols/criptography/hash/hash-comparer'
import { UnauthorizedError, ParamInUseError } from '@/errors'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'

export class EditUserUseCase implements EditUser {
  constructor (
    private readonly editUserRepository: EditUserRepository,
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async edit (user_id: number, user: EditUserModel, password?: string): Promise<boolean> {
    if (user.email) {
      const getUser = await this.getUserByEmailRepository.getByEmail(user.email)

      if (getUser) {
        throw new ParamInUseError('email')
      }
    }
    if (user.password) {
      const getUser = await this.getUserByIdRepository.getById(user_id)

      const isValid = await this.hashComparer.compare(getUser.password, password)
      if (!isValid) {
        throw new UnauthorizedError()
      }
    }

    await this.editUserRepository.edit(user_id, user)

    return true
  }
}
