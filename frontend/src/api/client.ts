/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface ApiErrorResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
}

export const getAuthToken = (): string => {
  return localStorage.getItem('chatdesk_auth_token') || '';
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('chatdesk_auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('chatdesk_auth_token');
};

export const getWorkspaceId = (): string => {
  return localStorage.getItem('chatdesk_workspace_id') || 'default-workspace';
};

export const setWorkspaceId = (workspaceId: string): void => {
  localStorage.setItem('chatdesk_workspace_id', workspaceId);
};

export interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean;
}

export const apiClient = async <T = any>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> => {
  const { skipAuth, ...fetchOptions } = options;
  const token = !skipAuth ? getAuthToken() : '';
  const workspaceId = getWorkspaceId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!skipAuth) {
    headers['x-workspace-id'] = workspaceId;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    const data: ApiErrorResponse & T = await response.json();

    if (response.status === 401 && !skipAuth) {
      removeAuthToken();
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/signup'
      ) {
        window.location.href = '/';
      }
      throw new Error(data.error?.message || data.message || 'Session expired. Please sign in again.');
    }

    if (!response.ok) {
      const errorMessage =
        data.error?.message ||
        data.message ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach backend API server at ' + API_BASE_URL, { cause: err });
    }
    throw err;
  }
};
