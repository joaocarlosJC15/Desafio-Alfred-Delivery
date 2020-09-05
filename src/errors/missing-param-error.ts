export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Parâmetro '${paramName}' não fornecido`)
    this.name = 'MissingParamError'
  }
}
