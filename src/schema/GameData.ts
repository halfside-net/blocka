import * as z from "zod/mini";
import { BlockTypeV1 } from "./BlockType";

export const zGameDataV1 = z.object({
  boardState: z.optional(
    z.array(
      z.array(
        z.union([z.literal(BlockTypeV1.EMPTY), z.literal(BlockTypeV1.NORMAL)])
      )
    )
  ),
  highScore: z.optional(z.number()),
  piecesUsed: z.optional(z.array(z.boolean())),
  score: z.optional(z.number()),
  seed: z.optional(z.number()),
});

export const zGameData = zGameDataV1;
export type GameData = z.infer<typeof zGameData>;
export type BoardState = NonNullable<GameData["boardState"]>;
