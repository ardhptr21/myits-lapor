import { z } from 'zod';

export const createReportValidator = z.object({
  title: z.string().min(3).max(200),
  location: z.string().min(3).max(200),
  priority: z.enum(['low', 'medium', 'high']),
  photos: z.array(z.string()),
});

export const updateReportValidator = createReportValidator.partial();

export const listReportsQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const createReportProgressValidator = z.object({
  description: z.string().max(500).optional(),
  photos: z.array(z.string()).optional(),
});
