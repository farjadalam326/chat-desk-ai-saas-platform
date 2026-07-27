/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, setAuthToken, setWorkspaceId, removeAuthToken } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  workspaceName?: string;
  companyName?: string;
}

export interface InviteAgentPayload {
  email: string;
  role: 'admin' | 'agent';
}

export const authApi = {
  signup: async (payload: SignupPayload) => {
    const body = {
      ...payload,
      workspaceName: payload.workspaceName || payload.companyName || 'My Workspace',
    };
    const res = await apiClient<{ success: boolean; data: { token: string; user: any; workspace: any } }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(body),
        skipAuth: true,
      }
    );
    if (res.data?.token) setAuthToken(res.data.token);
    if (res.data?.workspace?._id) setWorkspaceId(res.data.workspace._id);
    return res;
  },

  login: async (payload: LoginPayload) => {
    const res = await apiClient<{ success: boolean; data: { token: string; user: any; workspace: any } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(payload),
        skipAuth: true,
      }
    );
    if (res.data?.token) setAuthToken(res.data.token);
    if (res.data?.workspace?._id) setWorkspaceId(res.data.workspace._id);
    return res;
  },

  googleAuth: async (credential: string) => {
    const res = await apiClient<{ success: boolean; data: { token: string; user: any; workspace: any } }>(
      '/auth/google',
      {
        method: 'POST',
        body: JSON.stringify({ credential }),
        skipAuth: true,
      }
    );
    if (res.data?.token) setAuthToken(res.data.token);
    if (res.data?.workspace?._id) setWorkspaceId(res.data.workspace._id);
    return res;
  },

  logout: async () => {
    try {
      await apiClient<{ success: boolean; message: string }>('/auth/logout', {
        method: 'POST',
      });
    } catch (err: any) {
      console.warn('Logout API call error:', err);
    } finally {
      removeAuthToken();
    }
  },

  getMe: async () => {
    return apiClient<{ success: boolean; data: { user: any; workspace: any } }>('/auth/me');
  },

  getAgents: async () => {
    return apiClient<{ success: boolean; data: any[] }>('/auth/users');
  },

  inviteAgent: async (payload: InviteAgentPayload) => {
    return apiClient<{ success: boolean; data: any }>('/auth/users/invite', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  removeAgent: async (id: string) => {
    return apiClient<{ success: boolean; message: string }>(`/auth/users/${id}`, {
      method: 'DELETE',
    });
  },
};
