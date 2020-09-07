import request from 'supertest'
import { hash } from 'bcrypt'

import app from '../config/app'
import connection from '@/infra/db/postgresql/config/connection'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'

const tableName = 'users'
const fakeDate = new Date()

const makeFakeRequest = (): any => ({
  name: 'any_name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

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

  describe('POST /login', () => {
    test('/login deve retornar 200 para o caso de sucesso', async () => {
      const password = await hash(makeFakeCreateUser().password, 12)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      await connection(tableName).insert(fakeUser)

      await request(app)
        .post('/login')
        .send({
          email: makeFakeCreateUser().email,
          password: makeFakeCreateUser().password
        })
        .expect(200)
    })

    test('/login deve retornar 404 usuário não encontrado', async () => {
      await request(app)
        .post('/login')
        .send({
          email: makeFakeCreateUser().email,
          password: makeFakeCreateUser().password
        })
        .expect(404)
    })

    test('/login deve retornar 401 para senha invalida', async () => {
      const password = await hash(makeFakeCreateUser().password, 12)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      await connection(tableName).insert(fakeUser)

      await request(app)
        .post('/login')
        .send({
          email: makeFakeCreateUser().email,
          password: 'wrong_password'
        })
        .expect(401)
    })
  })
})
