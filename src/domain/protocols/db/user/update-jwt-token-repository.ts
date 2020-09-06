export interface UpdateAccessTokenRepository {
  updateJwtToken: (id: number, token: string) => Promise<void>
}
