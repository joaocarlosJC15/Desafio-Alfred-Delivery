import request from 'supertest'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import app from '../config/app'
import { jwtSecret } from '../config/env'
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

  describe('GET /users:user_id', () => {
    test('GET /users:user_id deve retornar um usuario para o caso de sucesso', async () => {
      const user = await connection(tableName).insert(makeFakeCreateUser())
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      const response = await request(app)
        .get(`/users/${user_id}`)
        .set('access-token', token)

      expect(response.body.id).toEqual(user_id)
    })

    test('GET /users:user_id deve retornar status 200 para o caso de sucesso', async () => {
      const user = await connection(tableName).insert(makeFakeCreateUser())
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .get(`/users/${user_id}`)
        .set('access-token', token)
        .expect(200)
    })

    test('GET /users:user_id deve retornar status 204 caso nao seja encontrado um usuario para o id passado ', async () => {
      const user = await connection(tableName).insert(makeFakeCreateUser())
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      const user2 = await connection(tableName).insert(makeFakeCreateUser())
      const user_id2 = user2[0]

      await request(app)
        .get(`/users/${user_id2}`)
        .set('access-token', token)
        .expect(204)
    })

    test('GET /users:user_id deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .get(`/users/${1}`)
        .set('access-token', 'abcde')
        .expect(401)
    })

    test('GET /users:user_id deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .get(`/users/${1}`)
        .expect(401)
    })
  })
})
