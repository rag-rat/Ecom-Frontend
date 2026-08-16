import axiosInstance from "./axiosInstance";

export const chatApi = {
  // Customer
  getChatHistory: async (page = 0, size = 50) => {
    const response = await axiosInstance.get("/api/chat/history", {
      params: { page, size },
    });
    return response.data;
  },

  // Admin
  getAllConversations: async (page = 0, size = 20) => {
    const response = await axiosInstance.get("/api/admin/chat/conversations", {
      params: { page, size },
    });
    return response.data;
  },

  getConversationMessages: async (conversationId, page = 0, size = 50) => {
    const response = await axiosInstance.get(
      `/api/admin/chat/conversations/${conversationId}/messages`,
      { params: { page, size } },
    );
    return response.data;
  },

  sendAdminReply: async (conversationId, content) => {
    const response = await axiosInstance.post(
      `/api/admin/chat/conversations/${conversationId}/reply`,
      { content },
    );
    return response.data;
  },

  closeConversation: async (conversationId) => {
    const response = await axiosInstance.put(
      `/api/admin/chat/conversations/${conversationId}/close`,
    );
    return response.data;
  },

  reopenConversation: async (conversationId) => {
    const response = await axiosInstance.put(
      `/api/admin/chat/conversations/${conversationId}/reopen`,
    );
    return response.data;
  },

  markConversationAsRead: async (conversationId) => {

    // console.log(conversationId)

    const response = await axiosInstance.put(
      `/api/admin/chat/conversations/${conversationId}/read`,
    );
    return response.data;
  },
};
