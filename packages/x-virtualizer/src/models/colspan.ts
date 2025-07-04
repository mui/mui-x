import { float, integer } from '@mui/x-internals/types';

export type ColumnIndex = number;
export type CellColSpanInfo =
  | {
      spannedByColSpan: true;
      rightVisibleCellIndex: ColumnIndex;
      leftVisibleCellIndex: ColumnIndex;
    }
  | {
      spannedByColSpan: false;
      cellProps: {
        colSpan: integer;
        width: float;
      };
    };
