
import axiosInstance from './axiosInstance'


export const categoryApi = {

  // Public
  getCategories: async () => {
    const response = await axiosInstance.get('/api/categories')
    return response.data
  },

  getCategoryById: async (categoryId) => {
    const response = await axiosInstance.get(`/api/categories/${categoryId}`)
    return response.data
  },

  
  // Admin
  getAllCategoriesAdmin: async () => {
    const response = await axiosInstance.get('/api/categories/admin/all')
    return response.data
  },

  createCategory: async (data) => {
    const response = await axiosInstance.post('/api/categories', data)
    return response.data
  },

  updateCategory: async (categoryId, data) => {
    const response = await axiosInstance.put(`/api/categories/${categoryId}`, data)
    return response.data
  },

  deleteCategory: async (categoryId) => {
    const response = await axiosInstance.delete(`/api/categories/${categoryId}`)
    return response.data
  },
}