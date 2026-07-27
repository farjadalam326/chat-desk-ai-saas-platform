import { z } from 'zod';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    sourceType: z.enum(['text', 'file', 'url']).default('text'),
  }),
});

export const crawlUrlSchema = z.object({
  body: z.object({
    url: z.string().url('Invalid website URL format'),
  }),
});
