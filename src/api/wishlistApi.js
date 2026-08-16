
import axiosInstance from './axiosInstance'

export const wishlistApi = {

  getWishlist: async () => {
    const response = await axiosInstance.get('/api/wishlist')
    return response.data
  },

  addToWishlist: async (productId) => {
    const response = await axiosInstance.post(`/api/wishlist/${productId}`)
    return response.data
  },

  removeFromWishlist: async (productId) => {
    const response = await axiosInstance.delete(`/api/wishlist/${productId}`)
    return response.data
  },
}