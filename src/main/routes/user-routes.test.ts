import request from 'supertest'
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import app from '../config/app'
import { jwtSecret, salt } from '../config/env'
import connection from '@/infra/db/postgresql/config/connection'
import { CreateUserModel } from '@/domain/usecases/user/create/protocols/create-user'

const tableName = 'users'
const fakeDate = new Date(2019, 3, 4)
const fakeEditDate = new Date(1998, 2, 3)

const makeFakeRequest = (): any => ({
  name: 'any_name',
  email: 'email@mail.com',
  birthDate: fakeDate,
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

const makeFakeRequestEditUser = (): any => ({
  name: 'name_edit',
  email: 'edit@email.com',
  birthDate: fakeEditDate,
  password: makeFakeCreateUser().password,
  newPassword: 'edit_password'
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
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

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
      const password = await bcrypt.hash(makeFakeCreateUser().password, 12)

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

  describe('PUT /users:user_id', () => {
    test('PUT /users:user_id deve retornar status 200 para o caso de sucesso', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .put(`/users/${user_id}`)
        .send(makeFakeRequestEditUser())
        .set('access-token', token)
        .expect(200)
    })

    test('PUT /users:user_id deve retornar status 204 para caso não seja encontrado o usuário buscado', async () => {
      const user = await connection(tableName).insert(makeFakeCreateUser())
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .put(`/users/${2}`)
        .send(makeFakeRequestEditUser())
        .set('access-token', token)
        .expect(204)
    })

    test('PUT /users/:user_id deve garantir que os campos passados sejam alterados no registro', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .put(`/users/${user_id}`)
        .send(makeFakeRequestEditUser())
        .set('access-token', token)
        .expect(200)

      const userEdited = await connection()
        .select()
        .from(tableName)
        .where(`${tableName}.id`, user_id)

      expect(userEdited[0].id).toEqual(user_id)
      expect(userEdited[0].email).toEqual(makeFakeRequestEditUser().email)
      expect(userEdited[0].name).toEqual(makeFakeRequestEditUser().name)
      expect(new Date(userEdited[0].birthDate)).toEqual(makeFakeRequestEditUser().birthDate)
      expect(await bcrypt.compare(makeFakeRequestEditUser().newPassword, userEdited[0].password)).toBeTruthy()
    })

    test('PUT /users/:user_id deve garantir que somente o campo email seja atualizado no registro caso somente ele seja passado', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      const fakeEditUser = makeFakeRequestEditUser()
      fakeEditUser.newPassword = ''
      fakeEditUser.birthDate = ''
      fakeEditUser.name = ''

      await request(app)
        .put(`/users/${user_id}`)
        .send(fakeEditUser)
        .set('access-token', token)
        .expect(200)

      const userEdited = await connection()
        .select()
        .from(tableName)
        .where(`${tableName}.id`, user_id)

      expect(userEdited[0].id).toEqual(user_id)
      expect(userEdited[0].email).toEqual(makeFakeRequestEditUser().email)
      expect(userEdited[0].name).toEqual(makeFakeCreateUser().name)
      expect(new Date(userEdited[0].birthDate)).toEqual(makeFakeCreateUser().birthDate)
      expect(await bcrypt.compare(makeFakeCreateUser().password, userEdited[0].password)).toBeTruthy()
    })

    test('PUT /users/:user_id deve garantir que somente o campo name seja atualizado no registro caso somente ele seja passado', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      const fakeEditUser = makeFakeRequestEditUser()
      fakeEditUser.newPassword = ''
      fakeEditUser.birthDate = ''
      fakeEditUser.email = ''

      await request(app)
        .put(`/users/${user_id}`)
        .send(fakeEditUser)
        .set('access-token', token)
        .expect(200)

      const userEdited = await connection()
        .select()
        .from(tableName)
        .where(`${tableName}.id`, user_id)

      expect(userEdited[0].id).toEqual(user_id)
      expect(userEdited[0].email).toEqual(makeFakeCreateUser().email)
      expect(userEdited[0].name).toEqual(makeFakeRequestEditUser().name)
      expect(new Date(userEdited[0].birthDate)).toEqual(makeFakeCreateUser().birthDate)
      expect(await bcrypt.compare(makeFakeCreateUser().password, userEdited[0].password)).toBeTruthy()
    })

    test('PUT /users/:user_id deve garantir que somente o campo birthDate seja atualizado no registro caso somente ele seja passado', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      const fakeEditUser = makeFakeRequestEditUser()
      fakeEditUser.newPassword = ''
      fakeEditUser.name = ''
      fakeEditUser.email = ''

      await request(app)
        .put(`/users/${user_id}`)
        .send(fakeEditUser)
        .set('access-token', token)
        .expect(200)

      const userEdited = await connection()
        .select()
        .from(tableName)
        .where(`${tableName}.id`, user_id)

      expect(userEdited[0].id).toEqual(user_id)
      expect(userEdited[0].email).toEqual(makeFakeCreateUser().email)
      expect(userEdited[0].name).toEqual(makeFakeCreateUser().name)
      expect(new Date(userEdited[0].birthDate)).toEqual(makeFakeRequestEditUser().birthDate)
      expect(await bcrypt.compare(makeFakeCreateUser().password, userEdited[0].password)).toBeTruthy()
    })

    test('PUT /users/:user_id deve garantir que somente o campo password seja atualizado no registro caso os campos newPassword e password sejam passados', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      await connection('users').update({ token }).where('users.id', user_id)

      const fakeEditUser = makeFakeRequestEditUser()
      fakeEditUser.birthDate = ''
      fakeEditUser.name = ''
      fakeEditUser.email = ''

      await request(app)
        .put(`/users/${user_id}`)
        .send(fakeEditUser)
        .set('access-token', token)
        .expect(200)

      const userEdited = await connection()
        .select()
        .from(tableName)
        .where(`${tableName}.id`, user_id)

      expect(userEdited[0].id).toEqual(user_id)
      expect(userEdited[0].email).toEqual(makeFakeCreateUser().email)
      expect(userEdited[0].name).toEqual(makeFakeCreateUser().name)
      expect(new Date(userEdited[0].birthDate)).toEqual(makeFakeCreateUser().birthDate)
      expect(await bcrypt.compare(makeFakeRequestEditUser().newPassword, userEdited[0].password)).toBeTruthy()
    })

    test('PUT /users:user_id deve retornar status 403 para caso o password fornecido não condizer com o salvo no banco de dados', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      const editUser = makeFakeRequestEditUser()
      editUser.password = 'no_password'

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .put(`/users/${user_id}`)
        .send(editUser)
        .set('access-token', token)
        .expect(401)
    })

    test('PUT /users:user_id deve retornar status 403 para caso não seja fornecido o password ao tentar editar a senha', async () => {
      const password = await bcrypt.hash(makeFakeCreateUser().password, salt)

      const fakeUser = Object.assign({}, makeFakeCreateUser())
      fakeUser.password = password

      const user = await connection(tableName).insert(fakeUser)
      const user_id = user[0]

      const token = sign({ user_id }, jwtSecret)

      const editUser = makeFakeRequestEditUser()
      editUser.password = ''

      await connection('users').update({ token }).where('users.id', user_id)

      await request(app)
        .put(`/users/${user_id}`)
        .send(editUser)
        .set('access-token', token)
        .expect(401)
    })

    test('PUT /users:user_id deve retornar status 401 para quando for fornecido um token invalido', async () => {
      await request(app)
        .put(`/users/${1}`)
        .send(makeFakeRequestEditUser())
        .set('access-token', 'abcde')
        .expect(401)
    })

    test('PUT /users:user_id deve retornar status 401 para quando não for fornecido um token', async () => {
      await request(app)
        .put(`/users/${1}`)
        .send(makeFakeRequestEditUser())
        .expect(401)
    })
  })
})
