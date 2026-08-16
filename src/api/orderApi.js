
import axiosInstance from './axiosInstance'

export const orderApi = {

  // Customer
  placeOrder: async (data) => {
    const response = await axiosInstance.post('/api/orders', data)
    return response.data
  },

  getMyOrders: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/api/orders', { params: { page, size } })
    return response.data
  },

  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`/api/orders/${orderId}`)
    return response.data
  },

  cancelOrder: async (orderId, reason) => {
    const response = await axiosInstance.put(`/api/orders/${orderId}/cancel`, { reason })
    return response.data
  },


  
  // Admin
  getAllOrders: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/api/admin/orders', { params: { page, size } })
    return response.data
  },

  getOrdersByStatus: async (status, page = 0, size = 20) => {
    const response = await axiosInstance.get(
      `/api/admin/orders/status/${status}`,
      { params: { page, size } }
    )
    return response.data
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.put(
      `/api/admin/orders/${orderId}/status`,
      { status }
    )
    return response.data
  },

}