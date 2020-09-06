import { CreateUserRepository } from '@/domain/protocols/db/user/create-user-repository'
import { UserModel } from '@/domain/models/user'
import { CreateUserModel } from '@/domain/usecases/user/create/create-user'
import connection from '../config/connection'
import { serializeToUser } from './user-serialize'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'

export class UserRepository implements CreateUserRepository, GetUserByEmailRepository {
  tableName = 'users'

  async create (userCreate: CreateUserModel): Promise<UserModel> {
    const data = await connection(this.tableName).insert(userCreate)

    if (data) {
      const userData = await connection.select().from(this.tableName).where('users.id', data[0])

      if (userData) {
        return serializeToUser(userData[0])
      }
    }

    return null
  }

  async getByEmail (email: string): Promise<UserModel> {
    const data = await connection.select().from(this.tableName).where('users.email', email)

    if (data) {
      return serializeToUser(data[0])
    }

    return null
  }
}
