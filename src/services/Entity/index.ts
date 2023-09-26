import axios from 'axios'
import entityMapper from '../../mappers/Entity/entity.mapper'
import { Entity } from '../../schemas/Entity'

class EntityService {
  async getEntity(token: string, entityId: string): Promise<Entity> {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/entity/filter?entityId=${entityId}`
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return entityMapper(responseApi.data)
    } catch (error) {
      throw error
    }
  }

}

export default EntityService
