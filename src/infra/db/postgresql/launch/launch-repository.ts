import connection from '../config/connection'
import { CreateLaunchRepository } from '@/domain/protocols/db/launch/create-launch-repository'
import { CreateLaunchModel } from '@/domain/usecases/launch/create/protocols/create-launch'
import { LaunchModel } from '@/domain/models/launch'
import { serializeToLaunch } from './launch-serialize'

export class LaunchRepository implements CreateLaunchRepository {
  tableName = 'launchs'

  async create (launchCreate: CreateLaunchModel): Promise<LaunchModel> {
    const data = await connection(this.tableName).insert(launchCreate)

    if (data && data.length) {
      const id = Number(data[0])

      const userData = await connection
        .select(
          `${this.tableName}.id`,
          `${this.tableName}.description`,
          `${this.tableName}.type`,
          `${this.tableName}.input`,
          `${this.tableName}.output`,
          `${this.tableName}.balance`,
          `${this.tableName}.date`,
          `${this.tableName}.disabled`,
          'categories.id',
          'categories.name',
          'categories.disabled',
          'categories.description',
          'categories.user_id'
        )
        .from(this.tableName)
        .join('categories', `${this.tableName}.category_id`, 'categories.id')
        .where(`${this.tableName}.id`, id)

      if (userData) {
        return serializeToLaunch(userData[0])
      }
    }

    return null
  }
}
