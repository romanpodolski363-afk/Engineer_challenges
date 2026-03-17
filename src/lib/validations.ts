import { z } from 'zod';

export const addModelSchema = z.object({
  name: z.string().min(1, 'Model name is required').max(255),
  model_id: z
    .string()
    .min(1, 'Model ID is required')
    .max(255)
    .regex(
      /^[a-z0-9][a-z0-9._-]*$/,
      'Model ID must be lowercase alphanumeric with dots, hyphens, or underscores',
    ),
  provider_id: z.string().uuid('Invalid provider'),
  context_window: z.preprocess(
    (val) => (val === '' || val === undefined ? null : val),
    z.coerce
      .number()
      .int()
      .min(1, 'Context window must be at least 1')
      .max(10_000_000, 'Context window seems too large')
      .nullable()
      .optional(),
  ),
  status: z.enum(['evaluating', 'approved', 'deprecated']).default('evaluating'),
  notes: z.string().max(1000).optional().nullable(),
});

export type AddModelInput = z.infer<typeof addModelSchema>;
