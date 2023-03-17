import axios from 'axios'
import { ElectronicBill } from '../../schemas/ElectronicBill'

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
}

export default ElectronicBillService
