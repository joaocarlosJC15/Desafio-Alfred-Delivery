import { CreateUser, CreateUserModel } from './create-user'
import { UserModel } from '@/domain/models/user'
import { CreateUserRepository } from '@/domain/protocols/db/user/create-user-repository'
import { HashGenerate } from '@/domain/protocols/criptography/hash/hash-generate'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'

export class CreateUserUsecase implements CreateUser {
  constructor (
    private readonly createUserRepository: CreateUserRepository,
    private readonly hashGenerate: HashGenerate,
    private readonly getUserByEmailRepository: GetUserByEmailRepository
  ) {}

  async create (user: CreateUserModel): Promise<UserModel> {
    await this.hashGenerate.generate(user.password)

    return null
  }
}
