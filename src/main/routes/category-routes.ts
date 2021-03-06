import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthenticationMiddleware } from '../factories/middlewares/authentication-middleware-factory'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreateCategoryController } from '../factories/controllers/category/create/create-category-controller-factory'
import { makeGetCategoriesByUserController } from '../factories/controllers/category/get/allByUser/get-categories-by-user-controller-factory'
import { makeGetCategoryByUserController } from '../factories/controllers/category/get/oneByUser/get-category-by-user-controller-factory'
import { makeEditCategoryController } from '../factories/controllers/category/edit/edit-category-controller-factory'

export default (router: Router): void => {
  const authMiddleware = adaptMiddleware(makeAuthenticationMiddleware())
  router.post('/categories', authMiddleware, adaptRoute(makeCreateCategoryController()))
  router.get('/categories', authMiddleware, adaptRoute(makeGetCategoriesByUserController()))
  router.get('/categories/:category_id', authMiddleware, adaptRoute(makeGetCategoryByUserController()))
  router.put('/categories/:category_id', authMiddleware, adaptRoute(makeEditCategoryController()))
}
