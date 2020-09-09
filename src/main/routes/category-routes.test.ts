import request from 'supertest'
import { sign } from 'jsonwebtoken'

import app from '../config/app'
import connection from '@/infra/db/postgresql/config/connection'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'
import { jwtSecret } from '../config/env'
import { CreateCategoryModel } from '@/domain/usecases/category/create/protocols/create-category'

const tableName = 'categories'

const makeFakeRequestToCreateCategory = (): any => ({
  name: 'name',
  description: 'description'
})

const makeFakeCreateCategory = (): CreateCategoryModel => ({
  name: 'name',
  description: 'email@mail.com',
  disabled: false,
  user_id: 0
})

const makeFakeRequestToEditCategory = (): any => ({
  name: 'edit_name',
  description: 'edit_email@mail.com',
  disabled: true
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
        .send(makeFakeRequestToCreateCategory())
        .expect(200)
    })

    test('POST /categories deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .post('/categories')
        .set('access-token', 'abcde')
        .send(makeFakeRequestToCreateCategory())
        .expect(401)
    })

    test('POST /categories deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .post('/categories')
        .send(makeFakeRequestToCreateCategory())
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
        .send(makeFakeRequestToCreateCategory())

      expect(response.body.length).toBe(2)
    })

    test('GET /categories deve retornar status 200 para o caso não seja encontrada nenhuma categoria', async () => {
      await request(app)
        .get('/categories')
        .set('access-token', token)
        .expect(204)
    })

    test('GET /categories deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .get('/categories')
        .set('access-token', 'abcde')
        .expect(401)
    })

    test('GET /categories deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .get('/categories')
        .expect(401)
    })
  })

  describe('GET /categories/:category_id', () => {
    test('GET /categories/:category_id deve retornar uma categoria para o caso de sucesso', async () => {
      const category = makeFakeCreateCategory()
      category.user_id = user_id

      const categoryInserted = await connection('categories').insert(category)
      const category_id = categoryInserted[0]

      const response = await request(app)
        .get(`/categories/${category_id}`)
        .set('access-token', token)

      expect(response.body.id).toEqual(category_id)
    })

    test('GET /categories/:category_id deve retornar status 204 para o caso não seja encontrado uma categoria para o id passado', async () => {
      await request(app)
        .get(`/categories/${1}`)
        .set('access-token', token)
        .expect(204)
    })

    test('GET /categories/:category_id deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .get(`/categories/${1}`)
        .set('access-token', 'abcde')
        .expect(401)
    })

    test('GET /categories/:category_id deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .get(`/categories/${1}`)
        .expect(401)
    })
  })

  describe('PUT /categories/:category_id', () => {
    test('PUT /categories/:category_id deve retornar 200 para o caso de sucesso', async () => {
      const category = makeFakeCreateCategory()
      category.user_id = user_id

      const categoryInserted = await connection('categories').insert(category)
      const category_id = categoryInserted[0]

      await request(app)
        .put(`/categories/${category_id}`)
        .set('access-token', token)
        .send(makeFakeRequestToEditCategory())
        .expect(200)
    })

    test('PUT /categories/:category_id deve retornar 204 para o caso seja passada o id de uma categoria inexistente', async () => {
      const category = makeFakeCreateCategory()
      category.user_id = user_id

      await connection('categories').insert(category)

      await request(app)
        .put(`/categories/${0}`)
        .set('access-token', token)
        .send(makeFakeRequestToEditCategory())
        .expect(204)
    })

    test('PUT /categories/:category_id deve retornar 204 para o caso seja passada o id de uma categoria que pertence a outro usuario', async () => {
      const category = makeFakeCreateCategory()
      category.user_id = user_id

      const categoryInserted = await connection('categories').insert(category)
      const category_id = categoryInserted[0]

      const user = await connection('users').insert(makeFakeCreateUser())
      const user_id_2 = user[0]

      const token = sign({ user_id_2 }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id_2)

      await request(app)
        .put(`/categories/${category_id}`)
        .set('access-token', token)
        .send(makeFakeRequestToEditCategory())
        .expect(204)
    })

    test('PUT /categories/:category_id deve retornar status 204 para o caso não seja encontrado uma categoria para o id passado', async () => {
      await request(app)
        .put(`/categories/${1}`)
        .set('access-token', token)
        .send(makeFakeRequestToEditCategory())
        .expect(204)
    })

    test('PUT /categories/:category_id deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .get(`/categories/${1}`)
        .set('access-token', 'abcde')
        .send(makeFakeRequestToEditCategory())
        .expect(401)
    })

    test('PUT /categories/:category_id deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .get(`/categories/${1}`)
        .send(makeFakeRequestToEditCategory())
        .expect(401)
    })
  })
})
