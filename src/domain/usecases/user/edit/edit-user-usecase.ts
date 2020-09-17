import { EditUser, EditUserModel } from './protocols/edit-user'
import { EditUserRepository } from '@/domain/protocols/db/user/edit-user-repository'
import { GetUserByIdRepository } from '@/domain/protocols/db/user/get-user-by-id-repository'
import { HashComparer } from '@/domain/protocols/criptography/hash/hash-comparer'
import { UnauthorizedError, ParamInUseError } from '@/errors'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'
import { HashGenerate } from '@/domain/protocols/criptography/hash/hash-generate'

export class EditUserUseCase implements EditUser {
  constructor (
    private readonly editUserRepository: EditUserRepository,
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly hashGenerate: HashGenerate
  ) {}

  async edit (user_id: number, userEdit: EditUserModel, password?: string): Promise<boolean> {
    if (userEdit.email) {
      const getUser = await this.getUserByEmailRepository.getByEmail(userEdit.email)

      if (getUser) {
        throw new ParamInUseError('email')
      }
    }
    if (userEdit.password) {
      const getUser = await this.getUserByIdRepository.getById(user_id)

      const isValid = await this.hashComparer.compare(password, getUser.password)
      if (!isValid) {
        throw new UnauthorizedError()
      }

      userEdit.password = await this.hashGenerate.generate(userEdit.password)
    }

    await this.editUserRepository.edit(user_id, userEdit)

    return true
  }
}
