import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreateUserController } from '../factories/controllers/user/create/create-user-controller-factory'
import { makeAuthenticationUserController } from '../factories/controllers/user/authentication/authentication-user-controller-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthenticationMiddleware } from '../factories/middlewares/authentication-middleware-factory'
import { makeGetUserByIdController } from '../factories/controllers/user/get/get-by-id/get-user-by-id-controller-factory'
import { makeEditUserController } from '../factories/controllers/user/edit/edit-user-controller-factory'

export default (router: Router): void => {
  const authMiddleware = adaptMiddleware(makeAuthenticationMiddleware())

  router.post('/users', adaptRoute(makeCreateUserController()))
  router.get('/users/:user_id', authMiddleware, adaptRoute(makeGetUserByIdController()))
  router.put('/users/:user_id', authMiddleware, adaptRoute(makeEditUserController()))
  router.post('/login', adaptRoute(makeAuthenticationUserController()))
}
