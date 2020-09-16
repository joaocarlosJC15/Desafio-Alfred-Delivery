import { LaunchModel } from '@/domain/models/launch'
import { CreateLaunchModel } from '@/domain/usecases/launch/create/protocols/create-launch'

export interface CreateLaunchRepository {
  create (launch: CreateLaunchModel): Promise<LaunchModel>
}
