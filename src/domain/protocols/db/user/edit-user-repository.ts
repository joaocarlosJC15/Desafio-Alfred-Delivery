import { UserModel } from '@/domain/models/user'

export interface EditUserRepository {
  edit: (user: UserModel) => Promise<UserModel>
}
