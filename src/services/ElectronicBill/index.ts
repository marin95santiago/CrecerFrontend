import axios from 'axios'
import { ElectronicBill, ElectronicBillFormSchema, ItemComplete, ScheduleForm } from '../../schemas/ElectronicBill'
import ElectronicBillMapper from '../../mappers/ElectronicBill/electronicBill.mapper'

class ElectronicBillService {
  async saveBill(billData: ElectronicBill, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/bill/electronic`
      const responseApi = await axios.post(url, billData, {
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
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/bill/electronic?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/bill/electronic`
      
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
      let url = `${process.env.REACT_APP_API}/api/v2/bill/electronic/${number}`
  
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

  async getSchedules(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, schedules: ScheduleForm[] }> {
    try {
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/bill/electronic/schedule?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/bill/electronic/schedule`
      
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const schedules = responseApi.data.schedules.map((schedule:any) => {
        return {
          startDate: schedule.startDate ?? '',
          endDate: schedule.endDate ?? 'No',
          name: schedule.name ?? '',
          intervalDays: schedule.intervalDays ?? '',
          entity: schedule.entity ?? '',
          code: schedule.code ?? '',
          idForm: schedule.idForm ?? ''
        }
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        schedules,
      }

    } catch (error) {
      throw error
    }
  }

  async deleteSchedule(token: string, code: string) : Promise<any> {
    try {
      let url = `${process.env.REACT_APP_API}/api/v2/bill/electronic/schedule/${code}`
  
      await axios.delete(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })
    } catch (error) {
      throw error
    }
  }
  
}

export default ElectronicBillService
