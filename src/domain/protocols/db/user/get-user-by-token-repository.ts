import { UserModel } from '@/domain/models/user'

export interface GetUserByTokenRepository {
  getByToken: (token: string) => Promise<UserModel>
}
