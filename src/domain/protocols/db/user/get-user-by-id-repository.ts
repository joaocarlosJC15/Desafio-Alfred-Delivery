import { UserModel } from '@/domain/models/user'

export interface GetUserByIdRepository {
  getById: (id: number) => Promise<UserModel>
}
