export enum BlockType {
  EMPTY = 0,
  NORMAL = 1,
}

export const scoreByBlockType: Record<BlockType, number> = {
  [BlockType.EMPTY]: 0,
  [BlockType.NORMAL]: 1
};
