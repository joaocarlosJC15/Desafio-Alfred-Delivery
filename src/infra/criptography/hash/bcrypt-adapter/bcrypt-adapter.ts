import bcrypt from 'bcrypt'
import { HashGenerate } from '@/domain/protocols/criptography/hash/hash-generate'
import { HashComparer } from '@/domain/protocols/criptography/hash/hash-comparer'

export class BcryptAdapter implements HashGenerate, HashComparer {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async generate (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)

    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
