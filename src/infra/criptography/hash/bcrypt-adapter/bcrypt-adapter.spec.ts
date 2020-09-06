import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BccryptAdapter', () => {
  describe('hash()', () => {
    test('bcrypt.hash deve ser chamado com os valores corretos', async () => {
      const sut = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.generate('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('bcrypt.hash deve retornar um hash se for bem sucedido', async () => {
      const sut = makeSut()

      const hash = await sut.generate('any_value')

      expect(hash).toBe('hash')
    })

    test('bcrypt.hash deve retornar uma excecao se uma excecao for gerada', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

      const promise = sut.generate('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('bcrypt.compare deve ser chamado com os valores corretos', async () => {
      const sut = makeSut()

      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare('any_value', 'any_hash')

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('bcrypt.hash deve retornar true se for bem sucedido', async () => {
      const sut = makeSut()

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(true)
    })

    test('bcrypt.hash deve retornar false se for fornecido um hash invalido', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(false)
    })

    test('bcrypt.compare deve retornar uma excecao se uma excecao for gerada', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

      const promise = sut.compare('any_value', 'any_hash')

      await expect(promise).rejects.toThrow()
    })
  })
})
