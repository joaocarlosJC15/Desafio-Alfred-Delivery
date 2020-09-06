import request from 'supertest'

import app from '../config/app'
import connection from '@/infra/db/postgresql/config/connection'

const tableName = 'users'
const fakeDate = new Date()

const makeFakeRequest = (): any => ({
  name: 'any_name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

describe('User Routes', () => {
  beforeAll(async () => {
    await connection.migrate.latest()
  })

  beforeEach(async () => {
    await connection(tableName).del()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  describe('POST /users', () => {
    test('/users deve retornar 200 para o caso de sucesso', async () => {
      await request(app)
        .post('/users')
        .send(makeFakeRequest())
        .expect(200)
    })
  })
})
