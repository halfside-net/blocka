import { BlockType } from './types';

export const scoreByBlockType: Record<BlockType, number> = {
  [BlockType.EMPTY]: 0,
  [BlockType.NORMAL]: 1
};
