export interface AccountReceipt {
  account: number
  value: number
}

export interface ConceptReceipt {
  account: number
  value: number
  description: string
}

export interface Receipt {
  entityId?: string
  userId?: string
  type?: {
    code: string
    description: string
  }
  date: string
  code: string
  description: string
  thirdDocument: string
  totalValueLetter: string
  total: number
  accounts: AccountReceipt[]
  concepts: ConceptReceipt[]
}
