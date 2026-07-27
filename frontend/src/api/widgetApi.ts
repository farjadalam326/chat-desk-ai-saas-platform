import { apiClient } from './client';

export interface WidgetConfig {
  primaryColor?: string;
  botName?: string;
  greeting?: string;
  position?: 'right' | 'left';
  allowedDomains?: string[];
  theme?: 'light' | 'dark' | 'auto';
  apiKey?: string;
}

export const widgetApi = {
  getConfig: async () => {
    return apiClient<{ success: boolean; data: WidgetConfig }>('/widget/config');
  },

  updateConfig: async (config: WidgetConfig) => {
    return apiClient<{ success: boolean; data: WidgetConfig }>('/widget/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  getPublicConfig: async (apiKey: string) => {
    return apiClient<{ success: boolean; data: WidgetConfig }>(`/widget/public-config/${apiKey}`);
  },
};
