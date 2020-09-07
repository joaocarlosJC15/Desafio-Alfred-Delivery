import { HttpResponse, HttpRequest } from '../protocols/http'

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
