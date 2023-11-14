export interface AccountDailyReport {
  account: number
  description: string
  initBalance: number
  endBalance: number
}

export interface ConceptDailyReport {
  description: string
  account: number
  type: {
    code: string
    description: string
  }
  receiptCode: string
  value: number
}

export interface DailyReportReceipt {
  date: string
  accounts: AccountDailyReport[]
  concepts: ConceptDailyReport[]
}