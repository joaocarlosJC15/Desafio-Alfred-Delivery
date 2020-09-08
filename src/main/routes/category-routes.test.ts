import request from 'supertest'
import { sign } from 'jsonwebtoken'

import app from '../config/app'
import connection from '@/infra/db/postgresql/config/connection'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import { jwtSecret } from '../config/env'
import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'

const tableName = 'categories'

const makeFakeRequest = (): any => ({
  name: 'name',
  description: 'description'
})

const makeFakeCreateCategory = (): CreateCategoryModel => ({
  name: 'name',
  description: 'email@mail.com',
  disabled: false,
  user_id: 0
})

const fakeDate = new Date()
const makeFakeCreateUser = (): CreateUserModel => ({
  name: 'name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'password'
})
let user_id: number
let token: string

describe('User Routes', () => {
  beforeAll(async () => {
    await connection.migrate.latest()
  })

  beforeEach(async () => {
    await connection(tableName).del()
    await connection('users').del()

    const user = await connection('users').insert(makeFakeCreateUser())
    user_id = user[0]

    token = sign({ user_id }, jwtSecret)

    await connection('users').update({ token }).where('users.id', user_id)
  })

  afterAll(async () => {
    await connection.destroy()
  })

  describe('POST /categories', () => {
    test('POST /categories deve retornar status 200 para o caso de sucesso', async () => {
      await request(app)
        .post('/categories')
        .set('access-token', token)
        .send(makeFakeRequest())
        .expect(200)
    })

    test('POST /categories deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .post('/categories')
        .set('access-token', 'abcde')
        .send(makeFakeRequest())
        .expect(401)
    })

    test('POST /categories deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .post('/categories')
        .send(makeFakeRequest())
        .expect(401)
    })
  })

  describe('GET /categories', () => {
    test('GET /categories deve retornar uma lista de categorias para o caso de sucesso', async () => {
      const category = makeFakeCreateCategory()
      category.user_id = user_id

      await connection('categories').insert(category)
      await connection('categories').insert(category)

      const response = await request(app)
        .get('/categories')
        .set('access-token', token)
        .send(makeFakeRequest())

      expect(response.body.length).toBe(2)
    })

    test('GET /categories deve retornar status 200 para o caso de sucesso', async () => {
      await request(app)
        .get('/categories')
        .set('access-token', token)
        .send(makeFakeRequest())
        .expect(200)
    })

    test('POST /categories deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .get('/categories')
        .set('access-token', 'abcde')
        .send(makeFakeRequest())
        .expect(401)
    })

    test('POST /categories deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .get('/categories')
        .send(makeFakeRequest())
        .expect(401)
    })
  })
})
