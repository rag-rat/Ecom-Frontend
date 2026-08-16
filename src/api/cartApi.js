
import axiosInstance from './axiosInstance'


export const cartApi = {

  getCart: async () => {
    const response = await axiosInstance.get('/api/cart')
    return response.data
  },

  addToCart: async (productId, quantity) => {
    const response = await axiosInstance.post('/api/cart/items', { productId, quantity })
    return response.data
  },

  updateQuantity: async (productId, quantity) => {
    const response = await axiosInstance.put(`/api/cart/items/${productId}`, { quantity })
    return response.data
  },

  removeItem: async (productId) => {
    const response = await axiosInstance.delete(`/api/cart/items/${productId}`)
    return response.data
  },

  clearCart: async () => {
    const response = await axiosInstance.delete('/api/cart')
    return response.data
  },
}