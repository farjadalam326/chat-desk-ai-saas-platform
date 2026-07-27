import { apiClient } from './client';

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'agent';
  avatar?: string;
  status?: 'online' | 'offline' | 'busy';
  createdAt?: string;
}

export interface WebhookConfig {
  _id?: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface SecurityConfig {
  enforceSso: boolean;
  ssoProvider: string;
  enforce2FA: boolean;
  sessionTimeoutHours: number;
  ipWhitelist?: string;
}

export interface WorkspaceSettings {
  workspaceName?: string;
  domain?: string;
  apiKey?: string;
  aiModel?: string;
  systemPrompt?: string;
  temperature?: number;
  webhooks?: WebhookConfig[];
  security?: SecurityConfig;
  settings?: Record<string, unknown>;
}

export const settingsApi = {
  getSettings: async () => {
    return apiClient<{ success: boolean; data: WorkspaceSettings }>('/settings');
  },

  updateSettings: async (settings: WorkspaceSettings) => {
    return apiClient<{ success: boolean; data: WorkspaceSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  rotateApiKey: async () => {
    return apiClient<{ success: boolean; data: { apiKey: string } }>('/settings/rotate-key', {
      method: 'POST',
    });
  },

  // Team Members
  getTeamMembers: async () => {
    return apiClient<{ success: boolean; data: TeamMember[] }>('/settings/team');
  },

  inviteTeamMember: async (data: { name?: string; email: string; role: string }) => {
    return apiClient<{ success: boolean; data: TeamMember }>('/settings/team/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  removeTeamMember: async (id: string) => {
    return apiClient<{ success: boolean; message: string }>(`/settings/team/${id}`, {
      method: 'DELETE',
    });
  },

  // Webhooks
  addWebhook: async (data: { url: string; events: string[] }) => {
    return apiClient<{ success: boolean; data: WebhookConfig[] }>('/settings/webhooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  testWebhook: async (id: string) => {
    return apiClient<{ success: boolean; message: string; deliveredAt: string }>(`/settings/webhooks/${id}/test`, {
      method: 'POST',
    });
  },

  deleteWebhook: async (id: string) => {
    return apiClient<{ success: boolean; data: WebhookConfig[] }>(`/settings/webhooks/${id}`, {
      method: 'DELETE',
    });
  },
};
