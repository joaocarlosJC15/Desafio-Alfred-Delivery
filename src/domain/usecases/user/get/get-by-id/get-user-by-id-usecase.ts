import { GetUserById } from './protocols/get-user-by-id'
import { UserModel } from '@/domain/models/user'
import { GetUserByIdRepository } from '@/domain/protocols/db/user/get-user-by-id-repository'

export class GetUserByIdUseCase implements GetUserById {
  constructor (
    private readonly getUserByIdRepository: GetUserByIdRepository
  ) {}

  async getById (user_id: number): Promise<UserModel> {
    const user = await this.getUserByIdRepository.getById(user_id)

    return user
  }
}
