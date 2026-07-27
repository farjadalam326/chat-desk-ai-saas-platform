import { apiClient } from './client';

export interface CreateDocumentPayload {
  title: string;
  content: string;
  sourceType?: 'text' | 'file' | 'pdf' | 'url';
}

export interface DocumentItem {
  _id: string;
  workspaceId: string;
  title: string;
  content: string;
  sourceType: string;
  status: string;
  charCount: number;
  createdAt: string;
  updatedAt: string;
}

export const knowledgeApi = {
  getDocuments: async (params?: { search?: string; sourceType?: string; status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const endpoint = query ? `/knowledge-base?${query}` : '/knowledge-base';
    return apiClient<{ success: boolean; data: DocumentItem[] }>(endpoint);
  },

  createTextDoc: async (payload: CreateDocumentPayload) => {
    return apiClient<{ success: boolean; data: DocumentItem }>('/knowledge-base/text', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  crawlUrl: async (url: string) => {
    return apiClient<{ success: boolean; data: DocumentItem }>('/knowledge-base/crawl', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  deleteDocument: async (id: string) => {
    return apiClient<{ success: boolean; message: string }>(`/knowledge-base/${id}`, {
      method: 'DELETE',
    });
  },

  reindexKnowledge: async () => {
    return apiClient<{ success: boolean; message: string }>('/knowledge-base/reindex', {
      method: 'POST',
    });
  },
};
