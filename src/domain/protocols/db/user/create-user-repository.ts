import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import { UserModel } from '@/domain/models/user'

export interface CreateUserRepository {
  create: (user: CreateUserModel) => Promise<UserModel>
}
