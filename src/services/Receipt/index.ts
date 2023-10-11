import axios from 'axios'
import { receiptMapper } from '../../mappers/Receipt/receipt.mapper'
import { Receipt } from '../../schemas/Receipt'

class ReceiptService {
  async saveReceipt(receiptData: Receipt, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/receipt` 
      const responseApi = await axios.post(url, receiptData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }


  async getReceiptByCode(token: string, code: string) : Promise<Receipt> {
    try {
      let url = `${process.env.REACT_APP_API}/api/v2/receipt/${code}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const concept = receiptMapper(responseApi.data) 

      return concept
    } catch (error) {
      throw error
    }
  }

  async getReceipts(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, receipts: Receipt[] }> {
    try {
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/receipt?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/receipt`
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const receipts = responseApi.data.receipts.map((receipt:any) => {
        return receiptMapper(receipt)
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        receipts: receipts
      }

    } catch (error) {
      throw error
    }
  }
}

export default ReceiptService
