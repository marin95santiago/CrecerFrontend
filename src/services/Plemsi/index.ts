import axios from 'axios'
import { listObject } from '../../mappers/Common/comon.mapper'

class PlemsiService {
  async getCities(apikey: string) {
    try {
      const responseApi = await axios.get(`${process.env.REACT_APP_PLEMSI_API}/common/list/municipality`, {
        headers: {
          authorization: `Bearer ${apikey}`
        }
      })
      const data = listObject(responseApi.data.data)
      return data
    } catch (error) {
      throw error
    }
  }

  async getBill(apikey: string, number: number) {
    try {
      const responseApi = await axios.get(`${process.env.REACT_APP_PLEMSI_API}/billing/invoice/one?by=number&value=${number}&prefix=${process.env.REACT_APP_PLEMSI_PREFIX}`, {
        headers: {
          authorization: `Bearer ${apikey}`
        }
      })
      return responseApi.data.data.preview
    } catch (error) {
      throw error
    }
  }
}

export default PlemsiService
