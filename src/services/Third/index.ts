import axios from 'axios'
import { Third } from '../../schemas/Third'

class ThirdService {
  async saveThird(thirdData: Third, token: string) {
    try {
      const responseApi = await axios.post('/api/v2/third', thirdData, {
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

export default ThirdService
