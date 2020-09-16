import { LaunchModel } from '@/domain/models/launch'
import { serializeToCategory } from '../category/category-serialize'

export const serializeToLaunch = (data: any): LaunchModel => {
  return {
    id: data.users_id ? Number(data.users_id) : Number(data.id),
    description: data.users_description ? data.users_description : data.description,
    type: data.users_type ? data.users_type : data.type,
    input: data.users_input ? Number(data.users_input) : Number(data.input),
    output: data.users_output ? Number(data.users_output) : Number(data.output),
    balance: data.users_balance ? Number(data.users_balance) : Number(data.balance),
    date: data.users_date ? new Date(data.users_date) : new Date(data.date),
    disabled: data.users_disabled ? Boolean(data.users_disabled) : Boolean(data.disabled),
    category: serializeToCategory(data)
  }
}
