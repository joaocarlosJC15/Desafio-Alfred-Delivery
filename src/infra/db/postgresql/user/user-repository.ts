import { CreateUserRepository } from '@/domain/protocols/db/user/create-user-repository'
import { UserModel } from '@/domain/models/user'
import { CreateUserModel } from '@/domain/usecases/user/create/create-user'
import connection from '../config/connection'
import { serializeToUser } from './user-serialize'

export class UserRepository implements CreateUserRepository {
  tableName = 'users'

  async create (userCreate: CreateUserModel): Promise<UserModel> {
    const data = await connection(this.tableName).insert(userCreate)

    const userData = await connection.select().from(this.tableName).where('users.id', data[0])

    return serializeToUser(userData[0])
  }
}
