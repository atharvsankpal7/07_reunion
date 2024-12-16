import * as z from 'zod';

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot be more than 100 characters'),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  priority: z.number()
    .min(1, 'Priority must be between 1 and 5')
    .max(5, 'Priority must be between 1 and 5'),
  status: z.enum(['pending', 'finished'])
});