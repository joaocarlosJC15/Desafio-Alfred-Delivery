import { UserRepository } from '@/infra/db/postgresql/user/user-repository'
import { EditUserUseCase } from '@/domain/usecases/user/edit/edit-user-usecase'
import { BcryptAdapter } from '@/infra/criptography/hash/bcrypt-adapter/bcrypt-adapter'
import { salt } from '@/main/config/env'
import { EditUser } from '@/domain/usecases/user/edit/protocols/edit-user'

export const makeEditUserUsecase = (): EditUser => {
  const userRepository = new UserRepository()
  const bcryptAdapter = new BcryptAdapter(salt)

  return new EditUserUseCase(
    userRepository,
    userRepository,
    userRepository,
    bcryptAdapter,
    bcryptAdapter
  )
}
