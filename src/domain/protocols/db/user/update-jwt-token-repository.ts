export interface UpdateJwtTokenRepository {
  updateJwtToken: (id: number, token: string) => Promise<void>
}
