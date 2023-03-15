import axios from 'axios'
import jwt from 'jwt-decode'
import userMapper from '../../mappers/User/user.mapper'
import { User } from '../../schemas/User'

type jwtDecode = {
  data: any
}

class UserService {

  async login(email: string, password: string) {
    try {
      const responseApi = await axios.post('/api/v2/login', { email, password })
      const response = responseApi.data
      if (!response.token) throw new Error('No recuperó token')
      const tokenData = jwt<jwtDecode>(response.token)
      const userData = tokenData.data
      userData.token = response.token
      const user = userMapper(userData)

      return user
    } catch (error) {
      throw error
    }
  }

  async getUsers(token: string) {

    try {
      const responseApi = await axios.get('/api/v2/user', {
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
      const responseApi = await axios.post('/api/v2/user', userData, {
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
