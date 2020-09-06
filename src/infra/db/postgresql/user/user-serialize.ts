import { UserModel } from '@/domain/models/user'

export const serializeToUser = (data: any): UserModel => {
  return {
    id: data.users_id ? data.users_id : data.id,
    name: data.users_name ? data.users_name : data.name,
    email: data.users_email ? data.users_email : data.email,
    birthDate: data.users_birthDate ? new Date(data.users_birthDate) : new Date(data.birthDate),
    password: data.users_password ? data.users_password : data.password
  }
}
