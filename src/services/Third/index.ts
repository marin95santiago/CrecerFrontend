import axios from 'axios'
import thirdMapper from '../../mappers/Third/third.mapper'
import { Third } from '../../schemas/Third'

class ThirdService {
  async saveThird(thirdData: Third, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/third` 
      const responseApi = await axios.post(url, thirdData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async updateThird(thirdData: Third, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/third` 
      const responseApi = await axios.put(url, thirdData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async getThirds(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, thirds: Third[] }> {
    try {
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/third?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/third`
      
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const thirds = responseApi.data.thirds.map((third:any) => {
        return thirdMapper(third) 
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        thirds: thirds
      }

    } catch (error) {
      throw error
    }
  }

  async getThirdByDocument(token: string, document: string) : Promise<Third> {
    try {
      let url = `${process.env.REACT_APP_API}/api/v2/third/${document}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const third = thirdMapper(responseApi.data) 

      return third
    } catch (error) {
      throw error
    }
  }
}

export default ThirdService
