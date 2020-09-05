export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Parâmetro '${paramName}' inválido`)
    this.name = 'InvalidParamError'
  }
}
