import { CategoryModel } from './category'

export interface LaunchModel {
  id: number
  description: string
  type: string
  input: number
  output: number
  balance: number
  date: Date
  disabled: boolean
  category: CategoryModel
}
