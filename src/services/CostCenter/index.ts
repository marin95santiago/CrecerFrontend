import axios from 'axios'
import costCenterMapper from '../../mappers/CostCenter/costCenter.mapper'
import { CostCenter } from '../../schemas/CostCenter'

class CostCenterService {
  async saveCostCenter(costCenter: CostCenter, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/cost-center` 
      const responseApi = await axios.post(url, costCenter, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async updateCostCenter(costCenterData: CostCenter, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/cost-center` 
      const responseApi = await axios.put(url, costCenterData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async getCostCenterByCode(token: string, code: string) : Promise<CostCenter> {
    try {
      let url = `${process.env.REACT_APP_API}/api/v2/cost-center/${code}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const costCenter = costCenterMapper(responseApi.data) 

      return costCenter
    } catch (error) {
      throw error
    }
  }

  async getCostCenters(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, costCenters: CostCenter[] }>{
    try {
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/cost-center?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/cost-center`
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
      
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const costCenters = responseApi.data.costCenters.map((item:any) => {
        return costCenterMapper(item)
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        costCenters: costCenters
      }

    } catch (error) {
      throw error
    }
  }
}

export default CostCenterService
