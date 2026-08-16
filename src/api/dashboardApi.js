
import axiosInstance from './axiosInstance'

export const dashboardApi = {

  getSummary: async () => {
    const response = await axiosInstance.get('/api/admin/dashboard/summary')
    return response.data
  },
}