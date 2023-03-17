import axios from 'axios'
import thirdMapper from '../../mappers/Third/third.mapper'
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

  async getThirds(token: string) : Promise<Third[]> {
    try {
      const responseApi = await axios.get('/api/v2/third', {
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const thirds = responseApi.data.map((third:any) => {
        return thirdMapper(third) 
      })

      return thirds

    } catch (error) {
      throw error
    }
  }
}

export default ThirdService
