import { ElectronicBillFormSchema, ItemComplete, Tax } from "./schemas/ElectronicBill"

const Utils = {
  buildItem: (form: ElectronicBillFormSchema, applyTaxes: boolean): ItemComplete => {
    let tax = {
      code: '',
      description: '',
      percent: 0,
      taxAmount: 0,
      taxableAmount: 0
    }

    if (applyTaxes) {
      tax = {
        ...form.selectedTax,
        percent: form.currentPercentTax,
        taxAmount: ((form.currentQuantity * form.currentPrice) * form.currentPercentTax / 100),
        taxableAmount: (form.currentQuantity * form.currentPrice)
      }
    } else {
      tax = {
        code: '1',
        description: 'Iva',
        percent: 0,
        taxAmount: 0,
        taxableAmount: (form.currentQuantity * form.currentPrice)
      }
    }

    return {
      ...form.currentItem,
      itemType: form.currentItemType,
      price: form.currentPrice,
      quantity: form.currentQuantity,
      total: (form.currentQuantity * form.currentPrice),
      taxes: [
        tax
      ]
    }
  },

  buildTaxesForElectronicBill: (items: ItemComplete[]) : Tax[] | [] => {
    let res: Tax[]| any[] = []
    items.forEach(item => {
      res = res.concat(item.taxes)
    })
    console.log(res)
    return res
  }
}

export default Utils;