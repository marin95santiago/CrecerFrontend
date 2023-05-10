import axios from 'axios'
import { ElectronicBill, ElectronicBillFormSchema, ItemComplete } from '../../schemas/ElectronicBill'
import ElectronicBillMapper from '../../mappers/ElectronicBill/electronicBill.mapper'

class ElectronicBillService {
  async saveBill(billData: ElectronicBill, token: string) {
    try {
      const responseApi = await axios.post('/api/v2/bill/electronic', billData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async getElectronicBills(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, electronicBills: ElectronicBillFormSchema[] }> {
    try {
      let url = params !== undefined ? `/api/v2/bill/electronic?limit=${params.limit}` : '/api/v2/bill/electronic'
      
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const bills = responseApi.data.bills.map((bill:any) => {
        const parseBill = ElectronicBillMapper.schemaToForm(bill)
        return parseBill.form
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        electronicBills: bills
      }

    } catch (error) {
      throw error
    }
  }

  async getBillByNumber(token: string, number: number) : Promise<{ form: ElectronicBillFormSchema, items: ItemComplete[], taxes: any[] }> {
    try {
      let url = `/api/v2/bill/electronic/${number}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const bill = ElectronicBillMapper.schemaToForm(responseApi.data) 

      return bill
    } catch (error) {
      throw error
    }
  }
}

export default ElectronicBillService
