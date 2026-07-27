/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

export interface OverviewMetrics {
  totalConversations: number;
  openConversations?: number;
  pendingConversations?: number;
  resolvedConversations?: number;
  totalMessages?: number;
  aiResolutionRate: number;
  avgResponseTimeSec?: number;
  avgResponseTime?: string;
  csatScore: number;
}

export const analyticsApi = {
  getOverview: async () => {
    return apiClient<{ success: boolean; data: OverviewMetrics }>('/analytics/overview');
  },

  getTrends: async () => {
    return apiClient<{ success: boolean; data: any[] }>('/analytics/trends');
  },

  getUnanswered: async () => {
    return apiClient<{ success: boolean; data: any[] }>('/analytics/unanswered');
  },
};
