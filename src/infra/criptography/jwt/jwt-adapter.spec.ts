import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

const token = 'any_token'
const secretKey = 'secret'
const returnValue = 'any_value'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve(token))
  },

  async verify (): Promise<string> {
    return new Promise(resolve => resolve(returnValue))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secretKey)
}

describe('JwtAdapter', () => {
  describe('sign()', () => {
    test('jwt.encrypt deve ser chamado com os valores corretos', async () => {
      const sut = makeSut()

      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt(1)

      expect(signSpy).toHaveBeenCalledWith({ id: 1 }, secretKey)
    })

    test('jwt.encrypt deve retornar um token se for bem sucedido ', async () => {
      const sut = makeSut()

      const acessToken = await sut.encrypt(1)

      expect(acessToken).toBe(token)
    })

    test('jwt.encrypt deve retornar um excecao se uma excecao for gerada', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.encrypt(1)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('jwt.verify deve ser chamado com os valores corretos', async () => {
      const sut = makeSut()

      const signSpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt(token)

      expect(signSpy).toHaveBeenCalledWith(token, secretKey)
    })

    test('jwt.verify deve retornar um valor se for bem sucedido', async () => {
      const sut = makeSut()

      const acessToken = await sut.decrypt(returnValue)

      expect(acessToken).toBe(returnValue)
    })

    test('jwt.verify deve retornar uma excecao se uma excecao for gerada', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.decrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
