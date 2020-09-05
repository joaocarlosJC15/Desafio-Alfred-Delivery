import { UserModel } from '@/domain/models/user'

export interface GetUserByEmailRepository {
  getByEmail: (email: string) => Promise<UserModel>
}
