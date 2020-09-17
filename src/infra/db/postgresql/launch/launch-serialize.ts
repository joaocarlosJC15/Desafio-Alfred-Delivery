import { LaunchModel } from '@/domain/models/launch'
import { serializeToCategory } from '../category/category-serialize'

export const serializeToLaunch = (data: any): LaunchModel => {
  return {
    id: data.launchs_id ? Number(data.launchs_id) : Number(data.id),
    description: data.launchs_description ? data.launchs_description : data.description,
    type: data.launchs_type ? data.launchs_type : data.type,
    input: data.launchs_input ? Number(data.launchs_input) : Number(data.input),
    output: data.launchs_output ? Number(data.launchs_output) : Number(data.output),
    balance: data.launchs_balance ? Number(data.launchs_balance) : Number(data.balance),
    date: data.launchs_date ? new Date(data.launchs_date) : new Date(data.date),
    disabled: data.launchs_disabled ? Boolean(data.launchs_disabled) : Boolean(data.disabled),
    category: serializeToCategory(data)
  }
}
