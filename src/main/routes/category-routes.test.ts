import request from 'supertest'
import { sign } from 'jsonwebtoken'

import app from '../config/app'
import connection from '@/infra/db/postgresql/config/connection'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import { jwtSecret } from '../config/env'

const tableName = 'categories'

const makeFakeRequest = (): any => ({
  name: 'name',
  description: 'description'
})

const fakeDate = new Date()
const makeFakeCreateUser = (): CreateUserModel => ({
  name: 'name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'password'
})

describe('User Routes', () => {
  beforeAll(async () => {
    await connection.migrate.latest()
  })

  beforeEach(async () => {
    await connection(tableName).del()
    await connection('users').del()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  describe('POST /categories', () => {
    test('/categories deve retornar 200 para o caso de sucesso', async () => {
      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .post('/categories')
        .set('access-token', token)
        .send(makeFakeRequest())
        .expect(200)
    })

    test('/categories deve retornar 401 para quando for fornecido um token invalido', async () => {
      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .post('/categories')
        .set('access-token', 'abcde')
        .send(makeFakeRequest())
        .expect(401)
    })

    test('/categories deve retornar 401 para quando não for fornecido um token', async () => {
      await request(app)
        .post('/categories')
        .send(makeFakeRequest())
        .expect(401)
    })
  })
})
