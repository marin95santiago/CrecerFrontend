import { AccountReceipt, ConceptReceipt, Receipt } from "../../schemas/Receipt";

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
    total: Number(item.total) ?? 0,
    accounts: createAccounts(item.accounts),
    concepts: createConcepts(item.concepts)
  }
}