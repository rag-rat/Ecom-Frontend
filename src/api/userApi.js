
import axiosInstance from './axiosInstance'

export const userApi = {

  // Customer self-service
  getProfile: async () => {
    const response = await axiosInstance.get('/api/users/me')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put('/api/users/me', data)
    return response.data
  },

  changePassword: async (data) => {
    const response = await axiosInstance.put('/api/users/me/password', data)
    return response.data
  },



  // Admin
  getAllUsers: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/api/admin/users', {
      params: { page, size }
    })
    return response.data
  },

  searchUsers: async (keyword, page = 0, size = 20) => {
    const response = await axiosInstance.get('/api/admin/users/search', {
      params: { keyword, page, size }
    })
    return response.data
  },

  toggleUserActive: async (userId, activate) => {
    const endpoint = activate ? 'activate' : 'deactivate'
    const response = await axiosInstance.put(`/api/admin/users/${userId}/${endpoint}`)
    return response.data
  },

  updateUserRole: async (userId, role) => {
    const response = await axiosInstance.put(
      `/api/admin/users/${userId}/role`,
      { role }
    )
    return response.data
  },

}