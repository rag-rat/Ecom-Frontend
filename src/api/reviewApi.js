
import axiosInstance from './axiosInstance'

export const reviewApi = {

  // Public
  getProductReviews: async (productId, params = {}) => {
    const response = await axiosInstance.get(
      `/api/reviews/product/${productId}`,
      { params }
    )
    return response.data
  },

  getRatingsSummary: async (productId) => {
    const response = await axiosInstance.get(
      `/api/reviews/product/${productId}/summary`
    )
    return response.data
  },


  // Authenticated
  createReview: async (data) => {
    const response = await axiosInstance.post('/api/reviews', data)
    return response.data
  },

  updateReview: async (reviewId, data) => {
    const response = await axiosInstance.put(`/api/reviews/${reviewId}`, data)
    return response.data
  },

  deleteReview: async (reviewId) => {
    const response = await axiosInstance.delete(`/api/reviews/${reviewId}`)
    return response.data
  },

  getMyReviews: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/api/reviews/my-reviews', {
      params: { page, size }
    })
    return response.data
  },

  

  // Admin
  getAllReviewsAdmin: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/api/admin/reviews', {
      params: { page, size }
    })
    return response.data
  },

  adminDeleteReview: async (reviewId) => {
    const response = await axiosInstance.delete(`/api/admin/reviews/${reviewId}`)
    return response.data
  },
}