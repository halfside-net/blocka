import type { BlockType } from '~/components/Block/types';

export type BoardCellData = {
  colNum: number;
  rowNum: number;
};

export type BoardState = BlockType[][];
