import { Request, Response, NextFunction } from 'express'

export const cors = (request: Request, response: Response, next: NextFunction): void => {
  response.set('Access-Control-Allow-Origin', '*')
  response.set('Access-Control-Allow-Methods', '*')
  response.set('Access-Control-Allow-Headers', '*')
  next()
}
