import { UserRepository } from '@/infra/db/postgresql/user/user-repository'
import { GetUserByIdUseCase } from '@/domain/usecases/user/get/get-by-id/get-user-by-id-usecase'
import { GetUserById } from '@/domain/usecases/user/get/get-by-id/protocols/get-user-by-id'

export const makeGetUserByIdUsecase = (): GetUserById => {
  const userRepository = new UserRepository()

  return new GetUserByIdUseCase(userRepository)
}
