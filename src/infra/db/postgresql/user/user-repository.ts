import { CreateUserRepository } from '@/domain/protocols/db/user/create-user-repository'
import { UserModel } from '@/domain/models/user'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import connection from '../config/connection'
import { serializeToUser } from './user-serialize'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'
import { GetUserByIdRepository } from '@/domain/protocols/db/user/get-user-by-id-repository'
import { GetUsersRepository } from '@/domain/protocols/db/user/get-users-repository'
import { EditUserRepository } from '@/domain/protocols/db/user/edit-user-repository'
import { UpdateJwtTokenRepository } from '@/domain/protocols/db/user/update-jwt-token-repository'
import { GetUserByTokenRepository } from '@/domain/protocols/db/user/get-user-by-token-repository'
import { EditUserModel } from '@/domain/usecases/user/edit/protocols/edit-user'

export class UserRepository implements CreateUserRepository, GetUserByEmailRepository, GetUserByIdRepository, GetUsersRepository, EditUserRepository, UpdateJwtTokenRepository, GetUserByTokenRepository {
  tableName = 'users'

  async create (userCreate: CreateUserModel): Promise<UserModel> {
    const data = await connection(this.tableName).insert(userCreate).returning('*')

    if (data && data.length) {
      const id = Number(data[0]) ? data[0] : data[0].id

      const userData = await connection.select().from(this.tableName).where('users.id', id)

      if (userData) {
        return serializeToUser(userData[0])
      }
    }

    return null
  }

  async getByEmail (email: string): Promise<UserModel> {
    const data = await connection.select().from(this.tableName).where('users.email', email)

    if (data && data.length) {
      return serializeToUser(data[0])
    }

    return null
  }

  async getById (id: number): Promise<UserModel> {
    const data = await connection.select().from(this.tableName).where('users.id', id)

    if (data && data.length) {
      return serializeToUser(data[0])
    }

    return null
  }

  async getAll (): Promise<UserModel []> {
    const data = await connection.select().from(this.tableName)

    if (data && data.length) {
      const users: UserModel[] = []

      for (const element of data) {
        users.push(serializeToUser(element))
      }

      return users
    }
  }

  async edit (user_id: number, user: EditUserModel): Promise<void> {
    const fieldsEdit: any = {}

    for (const field in user) {
      if (user[field]) {
        fieldsEdit[field] = user[field]
      }
    }

    await connection(this.tableName).update(fieldsEdit).where('users.id', user_id)
  }

  async updateJwtToken (id: number, token: string): Promise<void> {
    const editUser = {
      token
    }

    await connection(this.tableName).update(editUser).where('users.id', id)
  }

  async getByToken (token: string): Promise<UserModel> {
    const data = await connection.select().from(this.tableName).where('users.token', token)

    if (data && data.length) {
      return serializeToUser(data[0])
    }

    return null
  }
}
