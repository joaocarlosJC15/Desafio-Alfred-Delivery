import { CreateUser, CreateUserModel } from './create-user'
import { UserModel } from '@/domain/models/user'
import { CreateUserRepository } from '@/domain/protocols/db/user/create-user-repository'
import { HashGenerate } from '@/domain/protocols/criptography/hash/hash-generate'
import { GetUserByEmailRepository } from '@/domain/protocols/db/user/get-user-by-email-repository'
import { ParamInUseError } from '@/errors'

export class CreateUserUsecase implements CreateUser {
  constructor (
    private readonly createUserRepository: CreateUserRepository,
    private readonly hashGenerate: HashGenerate,
    private readonly getUserByEmailRepository: GetUserByEmailRepository
  ) {}

  async create (user: CreateUserModel): Promise<UserModel> {
    const userByEmail = await this.getUserByEmailRepository.getByEmail(user.email)
    if (userByEmail) {
      throw new ParamInUseError('email')
    }

    await this.hashGenerate.generate(user.password)

    await this.createUserRepository.create(user)

    return null
  }
}
