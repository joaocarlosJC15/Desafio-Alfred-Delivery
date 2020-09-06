import path from 'path'

import { databaseSQLInfo } from '../../../../main/config/env' // path format because knex

export const test = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, '/migrations')
  }
}

export const development = {
  client: 'pg',
  version: '12.4',
  connection: {
    host: databaseSQLInfo.host,
    user: databaseSQLInfo.user,
    port: databaseSQLInfo.port,
    password: databaseSQLInfo.password,
    database: databaseSQLInfo.database
  },
  migrations: {
    directory: path.join(__dirname, '/migrations')
  }
}
