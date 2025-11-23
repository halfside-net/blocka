import * as z from "zod/mini";

export const zSettingsV1 = z.object({
  disableAnimations: z.optional(z.boolean()),
});

export const zSettings = zSettingsV1;
export type Settings = z.infer<typeof zSettings>;
