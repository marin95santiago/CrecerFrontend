import { CostCenter } from "../../schemas/CostCenter";
import { AccountReceipt, ConceptReceipt, Receipt } from "../../schemas/Receipt";
import { DailyReportReceipt } from "../../schemas/Receipt/dailyReport.schema";

export function createAccounts(data: any[], type?: any): AccountReceipt[] {
  const res: any[] = []
  data.forEach((item: any) => {
    res.push({
      account: Number(item.account),
      value: type && type.code === 'EGR' ? Number(item.value * -1) : Number(item.value),
      description: item.description,
      costCenterCode: item.costCenterCode ? item.costCenterCode :  item.costCenter.code
    })
  })

  return res
}

export function createConcepts(data: any[]): ConceptReceipt[] {
  const res: any[] = []
  data.forEach((item: any) => {
    res.push({
      account: Number(item.account),
      value: Number(item.value),
      description: item.description,
      costCenterCode: item.costCenterCode ? item.costCenterCode :  item.costCenter.code
    })
  })

  return res
}

export function createAccountsForForm(data: AccountReceipt[], costCenters: CostCenter[]): any[] {
  const res: any[] = []
  data.forEach((item: AccountReceipt) => {
    const costCenter = costCenters.find(cc => cc.code === item.costCenterCode)
    res.push({
      account: Number(item.account),
      value: Math.abs(Number(item.value)),
      description: item.description,
      costCenter: {
        description: costCenter?.description,
        code: item.costCenterCode
      }
    })
  })

  return res
}

export function createConceptsForForm(data: ConceptReceipt[], costCenters: CostCenter[]): any[] {
  const res: any[] = []
  data.forEach((item: any) => {
    const costCenter = costCenters.find(cc => cc.code === item.costCenterCode)
    res.push({
      account: Number(item.account),
      value: Math.abs(Number(item.value)),
      description: item.description,
      costCenter: {
        description: costCenter?.description,
        code: item.costCenterCode
      }
    })
  })

  return res
}

export function receiptMapper(item: any | unknown): Receipt {
  return {
    entityId: item.entityId ?? '',
    userId: item.userId ?? '',
    type: {
      code: item.type.code ?? '',
      description: item.type.description ?? ''
    },
    date: item.date ?? '',
    code: item.code ?? '',
    description: item.description ?? '',
    thirdDocument: item.thirdDocument ?? '',
    totalValueLetter: item.totalValueLetter ?? '',
    status: item.status ?? '',
    total: Number(item.total) ?? 0,
    accounts: createAccounts(item.accounts),
    concepts: createConcepts(item.concepts)
  }
}

export function dailyReportMapper(item: any | unknown): DailyReportReceipt {
  return {
    date: item.date ?? '',
    accounts: item.accounts.map((acc: any) => {
      return {
        account: acc.account ?? 0,
        description: acc.description ?? '',
        initBalance: acc.initBalance ?? 0,
        endBalance: acc.endBalance ?? 0
      }
    }),
    concepts: item.concepts.map((concept: any) => {
      return {
        account: concept.account ?? 0,
        description: concept.description ?? '',
        type: {
          code: concept.type?.code ?? '',
          description: concept.type?.description ?? ''
        },
        receiptCode: concept.receiptCode ?? '',
        value: concept.value
      }
    })
  }
}