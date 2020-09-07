import { UserModel } from '@/domain/models/user'

export interface GetUserByToken {
  getByToken: (token: string) => Promise<UserModel>
}
