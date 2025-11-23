import * as z from "zod/mini";
import { zGameDataV1 } from "./GameData";
import { zSettingsV1 } from "./Settings";

export const zAppDataV1 = z.object({
  gameData: z.optional(zGameDataV1),
  settings: z.optional(zSettingsV1),
  /**
   * AppData version
   */
  v: z.literal(1),
});

export const zAppData = zAppDataV1;
export type AppData = z.infer<typeof zAppData>;
