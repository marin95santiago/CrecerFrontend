import axios from 'axios'
import { listObject } from '../../mappers/Common/comon.mapper'

class PlemsiService {
  async getMunicipality() {
    try {
      const responseApi = await axios.get(`${process.env.REACT_APP_PLEMSI_API}/common/list/municipality`, {
        headers: {
          authorization: `Bearer ${process.env.REACT_APP_PLEMSI_KEY}`
        }
      })
      const data = listObject(responseApi.data.data)
      return data
    } catch (error) {
      throw error
    }
  }
}

export default PlemsiService
