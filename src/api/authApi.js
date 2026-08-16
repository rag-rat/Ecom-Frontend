
import axiosInstance from './axiosInstance'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * All authentication-related API calls in one place.
 * Components import FUNCTIONS from here, never call axiosInstance directly —
 * this means if the backend URL changes (/api/auth → /api/v2/auth),
 * you fix it in ONE file, not scattered across every component.
 *
 * Every function returns the response.data object which has our
 * standard { success, message, data } shape from the backend (Part 6).
 */


export const authApi = {

  register: async (userData) => {
    const response = await axiosInstance.post('/api/auth/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials)
    return response.data
  },

  logout: async (refreshToken) => {
    const response = await axiosInstance.post('/api/auth/logout', { refreshToken })
    return response.data
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/api/auth/refresh', { refreshToken })
    return response.data
  },

  verifyToken: async () => {
    const response = await axiosInstance.get('/api/auth/verify')
    return response.data
  },

  logoutAllDevices: async () => {
    const response = await axiosInstance.post('/api/auth/logout-all')
    return response.data
  },
}