import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthenticationMiddleware } from '../factories/middlewares/authentication-middleware-factory'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreateCategoryController } from '../factories/controllers/category/create/create-category-controller-factory'

export default (router: Router): void => {
  const authMiddleware = adaptMiddleware(makeAuthenticationMiddleware())
  router.post('/categories', authMiddleware, adaptRoute(makeCreateCategoryController()))
}
