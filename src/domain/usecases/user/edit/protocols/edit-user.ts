export interface EditUserModel {
  name?: string
  email?: string
  birthDate?: Date
  password?: string
}

export interface EditUser {
  edit: (user_id: number, user: EditUserModel, password?: string) => Promise<boolean>
}
