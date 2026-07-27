import { z } from 'zod';

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['open', 'pending', 'resolved', 'closed']),
  }),
});

export const assignAgentSchema = z.object({
  body: z.object({
    agentId: z.string().min(1, 'Agent ID is required'),
  }),
});

export const addNoteSchema = z.object({
  body: z.object({
    note: z.string().min(1, 'Note content is required'),
  }),
});

export const publicStartChatSchema = z.object({
  body: z.object({
    apiKey: z.string().min(1, 'API key is required'),
    visitorId: z.string().min(1, 'Visitor ID is required'),
    visitorInfo: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        ip: z.string().optional(),
        browser: z.string().optional(),
        location: z.string().optional(),
      })
      .optional(),
    message: z.string().min(1, 'Message text is required'),
  }),
});
