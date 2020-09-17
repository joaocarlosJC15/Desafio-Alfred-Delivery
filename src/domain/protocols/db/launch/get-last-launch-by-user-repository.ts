import { LaunchModel } from '@/domain/models/launch'

export interface GetLastLaunchByUserRepository {
  getLastLaunchByUser (user_id: number): Promise<LaunchModel>
}
