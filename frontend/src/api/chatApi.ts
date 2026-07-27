/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

export interface StartPublicChatPayload {
  workspaceId: string;
  visitorId: string;
  visitorName?: string;
  visitorEmail?: string;
}

export interface UpdateStatusPayload {
  status: 'active' | 'pending' | 'resolved' | 'closed';
}

export interface AssignAgentPayload {
  agentId: string;
}

export interface AddNotePayload {
  text: string;
}

export const chatApi = {
  startPublicChat: async (payload: StartPublicChatPayload) => {
    return apiClient<{ success: boolean; data: { conversation: any } }>('/conversations/public/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getConversations: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const endpoint = query ? `/conversations?${query}` : '/conversations';
    return apiClient<{ success: boolean; data: any[] }>(endpoint);
  },

  getConversationDetails: async (id: string) => {
    return apiClient<{ success: boolean; data: { conversation: any; messages: any[] } }>(
      `/conversations/${id}`
    );
  },

  updateStatus: async (id: string, status: 'active' | 'pending' | 'resolved' | 'closed') => {
    return apiClient<{ success: boolean; data: any }>(`/conversations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  assignAgent: async (id: string, agentId: string) => {
    return apiClient<{ success: boolean; data: any }>(`/conversations/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ agentId }),
    });
  },

  addNote: async (id: string, text: string) => {
    return apiClient<{ success: boolean; data: any }>(`/conversations/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  sendMessage: async (id: string, text: string, senderType: 'agent' | 'visitor' = 'agent') => {
    return apiClient<{ success: boolean; data: any }>(`/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, senderType }),
    });
  },
};
