import { CreateUser } from '@/domain/usecases/user/create/protocols/create-user'
import { BcryptAdapter } from '@/infra/criptography/hash/bcrypt-adapter/bcrypt-adapter'
import { salt } from '@/main/config/env'
import { UserRepository } from '@/infra/db/postgresql/user/user-repository'
import { CreateUserUsecase } from '@/domain/usecases/user/create/create-user-usecase'

export const makeCreateUserUseCase = (): CreateUser => {
  const bcryptAdapter = new BcryptAdapter(salt)
  const userRepository = new UserRepository()

  const createUserUseCase = new CreateUserUsecase(userRepository, bcryptAdapter, userRepository)

  return createUserUseCase
}
