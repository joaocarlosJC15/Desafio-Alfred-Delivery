import connection from '../config/connection'
import { CreateLaunchRepository } from '@/domain/protocols/db/launch/create-launch-repository'
import { CreateLaunchModel } from '@/domain/usecases/launch/create/protocols/create-launch'
import { LaunchModel } from '@/domain/models/launch'
import { serializeToLaunch } from './launch-serialize'
import { GetLastLaunchByUserRepository } from '@/domain/protocols/db/launch/get-last-launch-by-user-repository'

export class LaunchRepository implements CreateLaunchRepository, GetLastLaunchByUserRepository {
  tableName = 'launchs'

  async create (launchCreate: CreateLaunchModel): Promise<LaunchModel> {
    const data = await connection(this.tableName).insert(launchCreate)

    if (data && data.length) {
      const id = Number(data[0])

      const launchData = await connection
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

      if (launchData) {
        return serializeToLaunch(launchData[0])
      }
    }

    return null
  }

  async getLastLaunchByUser (user_id: number): Promise<LaunchModel> {
    const launch = await connection
      .select(
        `${this.tableName}.id as ${this.tableName}_id `,
        `${this.tableName}.description as ${this.tableName}_description`,
        `${this.tableName}.type as  ${this.tableName}_type`,
        `${this.tableName}.input as ${this.tableName}_input`,
        `${this.tableName}.output as ${this.tableName}_output`,
        `${this.tableName}.balance as ${this.tableName}_balance`,
        `${this.tableName}.date as ${this.tableName}_date`,
        `${this.tableName}.disabled as ${this.tableName}_disabled`,
        'categories.id as categories_id',
        'categories.name as categories_name',
        'categories.disabled as categories_disabled',
        'categories.description as categories_description',
        'categories.user_id as categories_user_id'
      )
      .from(this.tableName)
      .join('categories', `${this.tableName}.category_id`, 'categories.id')
      .whereRaw(`${this.tableName}.id = (SELECT max(${this.tableName}.id) FROM ${this.tableName} JOIN categories on ${this.tableName}.category_id = categories.id where categories.user_id = ?)`, user_id)

    if (launch && launch.length) {
      return serializeToLaunch(launch[0])
    }

    return null
  }
}
