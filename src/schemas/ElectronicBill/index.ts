import { Third } from '../Third'
import { Item } from '../Item'

export interface Tax {
  code: string
  description: string
  percent: number
  taxAmount: number
  taxableAmount: number
}

export interface ItemComplete {
  unitMeasure?: { code: number, description: string }
  description?: string
  code?: string
  itemType: {
    code: string
    description: string
  }
  price: number
  quantity: number
  total: number
  taxes: Tax[]
}

export interface ElectronicBill {
  date: string
  orderReference: string
  third: Third
  wayToPay: { code: string, description: string}
  paymentMethod: { code: string, description: string}
  paymentDueDate: string
  note: string
  items: ItemComplete[]
  taxes: Tax[]
  total: number
  totalTaxes: number
  totalToPay: number
}

export interface ElectronicBillFormSchema {
  date: string
  orderReference: string
  third?: Third
  wayToPay: { code: string, description: string}
  paymentMethod: { code: string, description: string}
  paymentDueDate: string
  note: string
  total: number
  totalTaxes: number
  totalToPay: number
  currentItem?: Item
  currentItemType: {
    code: string
    description: string
  }
  currentPrice: number
  currentQuantity: number
  selectedTax: {
    code: string
    description: string
  }
  currentPercentTax: number
}