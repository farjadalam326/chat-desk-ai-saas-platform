import { apiClient } from './client';

export interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: string;
  plan: string;
}

export interface BillingUsage {
  plan: 'starter' | 'pro' | 'enterprise' | string;
  conversations?: {
    used: number;
    limit: number;
  };
  knowledgeBase?: {
    documentsUsed: number;
    documentsLimit: number;
  };
  messagesUsed?: number;
  messagesLimit?: number;
  documentsCount?: number;
  documentsLimit?: number;
  billingCycle?: string;
  nextBillingDate?: string;
  invoices?: InvoiceItem[];
}

export interface PlanItem {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const billingApi = {
  getPublicPlans: async () => {
    return apiClient<{ success: boolean; data: PlanItem[] }>('/billing/plans', { skipAuth: true });
  },

  getUsage: async () => {
    return apiClient<{ success: boolean; data: BillingUsage }>('/billing/usage');
  },

  getInvoices: async () => {
    return apiClient<{ success: boolean; data: InvoiceItem[] }>('/billing/invoices');
  },

  createCheckoutSession: async (planId: string) => {
    return apiClient<{ success: boolean; data: { checkoutUrl: string; sessionId?: string } }>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  confirmPayment: async (planId: string) => {
    return apiClient<{ success: boolean; data: { workspace: Record<string, unknown>; message: string } }>('/billing/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  cancelSubscription: async () => {
    return apiClient<{ success: boolean; data: { workspace: Record<string, unknown>; message: string } }>('/billing/cancel', {
      method: 'POST',
    });
  },
};
