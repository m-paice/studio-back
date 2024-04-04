import { z } from 'zod';

export const schemaValidateBodyForCreate = z.object({
  name: z.string(),
});

export const schemaValidateParamsUUID = z.object({
  id: z.string().uuid(),
});
