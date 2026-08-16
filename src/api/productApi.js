import axiosInstance from './axiosInstance'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * All product-related API calls. Notice the params object pattern —
 * Axios automatically converts a params object into URL query strings:
 * { keyword: 'silk', minPrice: 1000 } → ?keyword=silk&minPrice=1000
 * This matches exactly what our ProductController (Part 9 backend) expects.
 */


export const productApi = {

  // Public — no token needed
  getProducts: async (filters = {}) => {
    // Remove undefined/null/empty values before sending
    const cleanParams = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== null && v !== undefined && v !== '')
    )
    const response = await axiosInstance.get('/api/products', { params: cleanParams })

    return response.data
  },


  getProductById: async (productId) => {
    const response = await axiosInstance.get(`/api/products/${productId}`)
    return response.data
  },


  getFeaturedProducts: async (page = 0, size = 10) => {
    const response = await axiosInstance.get('/api/products/featured', {
      params: { page, size }
    })
    return response.data
  },



  // Admin only
  createProduct: async (productData) => {
    const response = await axiosInstance.post('/api/products', productData)
    return response.data
  },

  updateProduct: async (productId, productData) => {
    const response = await axiosInstance.put(`/api/products/${productId}`, productData)
    return response.data
  },

  deleteProduct: async (productId) => {
    const response = await axiosInstance.delete(`/api/products/${productId}`)
    return response.data
  },



  // Image upload — multipart/form-data, different Content-Type
  uploadProductImage: async (productId, formData, isPrimary = false) => {
    const response = await axiosInstance.post(
      `/api/products/${productId}/images?isPrimary=${isPrimary}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },

  deleteProductImage: async (productId, publicId) => {
    const response = await axiosInstance.delete(
      `/api/products/${productId}/images/${encodeURIComponent(publicId)}`
    )
    return response.data
  },
  
}