import { HttpResponse } from '@/presentation/protocols'
import { InternalServerError, InvalidParamError, MissingParamError, ParamInUseError, NotFoundError } from '@/errors'
import { UnauthorizedError } from '@/errors/unauthorized-error'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: error
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: error
})

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack)
})

export const convertErrorToHttpResponse = (error: Error): HttpResponse => {
  if (error instanceof InvalidParamError) {
    return badRequest(error)
  } else if (error instanceof MissingParamError) {
    return badRequest(error)
  } else if (error instanceof ParamInUseError) {
    return conflict(error)
  } else if (error instanceof NotFoundError) {
    return notFound(error)
  } else if (error instanceof UnauthorizedError) {
    return unauthorized(error)
  } else {
    return serverError(error)
  }
}
