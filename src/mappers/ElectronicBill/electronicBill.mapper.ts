import { ElectronicBill, ElectronicBillFormSchema, ItemComplete } from "../../schemas/ElectronicBill";
import Utils from "../../utils";

const electronicBillMapper = {
  formToSchema: (form: ElectronicBillFormSchema, items: ItemComplete[]): ElectronicBill => {
    return {
      date: form.date,
      orderReference: form.orderReference,
      third: form.third ?? {
        document: '',
        dv: undefined,
        documentType: {
          code: '',
          description: ''
        },
        organizationType: {
          code: '',
          description: ''
        },
        liabilityType: {
          code: '',
          description: ''
        },
        regimeType: {
          code: '',
          description: ''
        },
        name: undefined,
        lastname: undefined,
        businessName: undefined,
        phone: '',
        address: '',
        email: ''
      },
      wayToPay: form.wayToPay,
      paymentMethod: form.paymentMethod,
      paymentDueDate: form.paymentDueDate,
      note: form.note,
      items: items,
      taxes: Utils.buildTaxesForElectronicBill(items),
      total: form.total,
      totalTaxes: form.totalTaxes,
      totalToPay: form.totalToPay
    }
  },

  schemaToForm: (bill: any): { form: ElectronicBillFormSchema, items: ItemComplete[], taxes: any[] } => {
    return {
      form: {
        number: Number(bill.number),
        date: bill.date,
        preview: bill.preview,
        orderReference: bill.orderReference,
        third: bill.third,
        wayToPay: { code: bill.wayToPay.code, description: bill.wayToPay.description },
        paymentMethod: { code: bill.paymentMethod.code, description: bill.paymentMethod.description },
        paymentDueDate: bill.paymentDueDate,
        note: bill.note,
        total: bill.total,
        totalTaxes: bill.totalTaxes,
        totalToPay: bill.totalToPay,
        currentItemType: {
          code: '',
          description: ''
        },
        currentPrice: 0,
        currentQuantity: 0,
        selectedTax: {
          code: '',
          description: ''
        },
        currentPercentTax: 0
      },
      items: bill.items,
      taxes: Utils.buildTaxesForElectronicBill(bill.items)
    }
  }
}

export default electronicBillMapper
