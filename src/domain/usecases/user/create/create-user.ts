import { UserModel } from '@/domain/models/user'

export interface CreateUserModel {
  name: string
  email: string
  birthDate: Date
  password: string
}

export interface CreateUser {
  create: (user: CreateUserModel) => Promise<UserModel>
}
