import { UserModel } from '@/domain/models/user'

export interface GetUserById {
  getById: (user_id: number) => Promise<UserModel>
}
