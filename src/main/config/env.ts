export const databaseSQLInfo = {
  host: process.env.DB_HOST ? process.env.DB_HOST : '127.0.0.1',
  user: 'postgres',
  port: 5432,
  password: 'postgres',
  database: 'alfred_delivery'
}

export const applicationPort = 3333

export const salt = 12

export const jwtSecret = 'sgjwprytgn-cnwposms'
