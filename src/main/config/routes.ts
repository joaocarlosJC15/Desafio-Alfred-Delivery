import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()

  app.use(router)

  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.')) {
      try {
        (await import(`../routes/${file}`)).default(router)
      } catch (error) {

      }
    }
  })
}
