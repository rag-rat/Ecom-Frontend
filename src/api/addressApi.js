
import axiosInstance from './axiosInstance'


export const addressApi = {

  getAddresses: async () => {
    const response = await axiosInstance.get('/api/addresses')
    return response.data
  },

  getAddressById: async (addressId) => {
    const response = await axiosInstance.get(`/api/addresses/${addressId}`)
    return response.data
  },

  createAddress: async (data) => {
    const response = await axiosInstance.post('/api/addresses', data)
    return response.data
  },

  updateAddress: async (addressId, data) => {
    const response = await axiosInstance.put(`/api/addresses/${addressId}`, data)
    return response.data
  },

  deleteAddress: async (addressId) => {
    const response = await axiosInstance.delete(`/api/addresses/${addressId}`)
    return response.data
  },

  setDefaultAddress: async (addressId) => {
    const response = await axiosInstance.put(`/api/addresses/${addressId}/set-default`)
    return response.data
  },
}