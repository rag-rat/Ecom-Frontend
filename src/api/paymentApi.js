
import axiosInstance from './axiosInstance'

export const paymentApi = {

  createPaymentOrder: async (orderId) => {
    const response = await axiosInstance.post('/api/payments/create-order', { orderId })
    return response.data
  },

  verifyPayment: async (paymentData) => {
    const response = await axiosInstance.post('/api/payments/verify', paymentData)
    return response.data
  },
}