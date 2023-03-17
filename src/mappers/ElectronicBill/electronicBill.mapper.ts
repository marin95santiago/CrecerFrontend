import { ElectronicBill, ElectronicBillFormSchema, ItemComplete } from "../../schemas/ElectronicBill";
import Utils from "../../utils";

export default function electronicBillMapper(form: ElectronicBillFormSchema, items: ItemComplete[]): ElectronicBill {
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
}
