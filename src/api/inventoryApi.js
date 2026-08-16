
import axiosInstance from './axiosInstance'


export const inventoryApi = {

  getInventory: async (productId) => {
    const response = await axiosInstance.get(`/api/inventory/${productId}`)
    return response.data
  },

  restock: async (productId, quantity) => {
    const response = await axiosInstance.post(
      `/api/inventory/${productId}/restock`,
      { quantity }
    )
    return response.data
  },

  updateThreshold: async (productId, threshold) => {
    const response = await axiosInstance.put(
      `/api/inventory/${productId}/low-stock-threshold`,
      { threshold }
    )
    return response.data
  },
}