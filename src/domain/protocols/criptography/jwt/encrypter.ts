export interface Encrypter {
  encrypt: (id: number) => Promise<string>
}
