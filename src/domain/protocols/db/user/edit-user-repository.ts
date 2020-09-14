import { EditUserModel } from '@/domain/usecases/user/edit/protocols/edit-user'

export interface EditUserRepository {
  edit: (user_id: number, user: EditUserModel) => Promise<void>
}
