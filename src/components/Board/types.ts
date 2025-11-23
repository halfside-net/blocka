export type BoardCellAddress = {
  colNum: number;
  rowNum: number;
};

export type BoardCellOverlay = BoardCellAddress & {
  className?: string;
  content: React.ReactNode;
  key: string;
  zIndex?: number;
};
