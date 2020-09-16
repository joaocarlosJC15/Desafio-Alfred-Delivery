export interface CreateLaunchModel {
  description: string
  type: string
  input: number
  output: number
  balance: number
  date: Date
  disabled: boolean
  category_id: number
}
