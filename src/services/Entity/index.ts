import axios from 'axios'
import entityMapper from '../../mappers/Entity/entity.mapper'
import { Entity } from '../../schemas/Entity'

class EntityService {
  async getEntity(token: string, entityId: string): Promise<Entity> {
    try {
      const responseApi = await axios.get(`/api/v2/entity/filter?entityId=${entityId}`, {
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
