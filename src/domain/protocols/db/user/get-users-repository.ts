import { UserModel } from '@/domain/models/user'

export interface GetUsersRepository {
  getAll: () => Promise<UserModel []>
}
