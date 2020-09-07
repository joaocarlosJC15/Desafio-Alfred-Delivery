import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreateUserController } from '../factories/controllers/user/create-user/create-user-controller-factory'
import { makeAuthenticationUserController } from '../factories/controllers/user/authentication/authentication-user-controller-factory'

export default (router: Router): void => {
  router.post('/users', adaptRoute(makeCreateUserController()))
  router.post('/login', adaptRoute(makeAuthenticationUserController()))
}
