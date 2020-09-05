export class ParamInUseError extends Error {
  constructor (paramName: string) {
    super(`O ${paramName} fornecido já está sendo utilizado`)
    this.name = 'ParamInUseError'
  }
}
