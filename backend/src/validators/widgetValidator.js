import { z } from 'zod';

export const updateWidgetSchema = z.object({
  body: z.object({
    botName: z.string().min(1).optional(),
    welcomeMessage: z.string().min(1).optional(),
    primaryColor: z.string().optional(),
    themeMode: z.enum(['light', 'dark']).optional(),
    position: z.enum(['bottom-right', 'bottom-left']).optional(),
    avatarUrl: z.string().optional(),
    customCss: z.string().optional(),
    allowedDomains: z.array(z.string()).optional(),
  }),
});
