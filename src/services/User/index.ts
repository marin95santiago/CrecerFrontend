import axios from 'axios'
import jwt from 'jwt-decode'
import Cookies from 'js-cookie'
import entityMapper from '../../mappers/Entity/entity.mapper'
import userMapper from '../../mappers/User/user.mapper'
import { User } from '../../schemas/User'

type jwtDecode = {
  data: any
}

class UserService {

  async login(email: string, password: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/login`
      const responseApi = await axios.post(url, { email, password })
      const response = responseApi.data
      if (!response.token) throw new Error('No recuperó token')
      const tokenData = jwt<jwtDecode>(response.token)
      const userData = tokenData.data.user
      const entityData = tokenData.data.entity
      userData.token = response.token
      const user = userMapper(userData)
      const entity = entityMapper(entityData)
      Cookies.set('auth', response.token)

      return {
        user,
        entity
      }
    } catch (error) {
      throw error
    }
  }

  async getUsers(token: string) {

    try {
      const url = `${process.env.REACT_APP_API}/api/v2/user`
      const responseApi = await axios.get(url, {
        headers: {
          authorization: token
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async saveUser(userData: User, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/user`
      const responseApi = await axios.post(url, userData, {
        headers: {
          authorization: token
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }
}

export default UserService
