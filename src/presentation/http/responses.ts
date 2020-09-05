import { HttpResponse } from '@/presentation/protocols'
import { InternalServerError, InvalidParamError, MissingParamError, ParamInUseError } from '@/errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
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

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const convertErrorToHttpResponse = (error: Error): HttpResponse => {
  if (error instanceof InvalidParamError) {
    return badRequest(error)
  } else if (error instanceof MissingParamError) {
    return badRequest(error)
  } if (error instanceof ParamInUseError) {
    return conflict(error)
  } else {
    return serverError(error)
  }
}
