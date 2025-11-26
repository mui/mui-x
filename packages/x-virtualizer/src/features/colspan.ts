import useEventCallback from '@mui/utils/useEventCallback';
import { Store } from '@mui/x-internals/store';
import type { integer } from '@mui/x-internals/types';
import type { BaseState, ParamsWithDefaults } from '../useVirtualizer';
import type { ColumnWithWidth, RowId } from '../models';
import type { CellColSpanInfo } from '../models/colspan';
import { Virtualization } from './virtualization';

/* eslint-disable import/export, @typescript-eslint/no-redeclare */

type ColumnIndex = number;
type ColspanMap = Map<RowId, Record<ColumnIndex, CellColSpanInfo>>;

export type ColspanParams = {
  enabled: boolean;
  getColspan: (rowId: RowId, column: ColumnWithWidth, columnIndex: integer) => integer;
};

const selectors = {};

export const Colspan = {
  initialize: initializeState,
  use: useColspan,
  selectors,
};
export namespace Colspan {
  export type State = {
    colspanMap: ColspanMap;
  };
  export type API = ReturnType<typeof useColspan>;
}

function initializeState(_params: ParamsWithDefaults) {
  return {
    colspanMap: new Map(),
  };
}

function useColspan(
  store: Store<BaseState & Colspan.State>,
  params: ParamsWithDefaults,
  api: Virtualization.API,
) {
  const getColspan = params.colspan?.getColspan;

  const resetColSpan = () => {
    store.state.colspanMap = new Map();
  };

  const getCellColSpanInfo = (rowId: RowId, columnIndex: integer) => {
    return store.state.colspanMap.get(rowId)?.[columnIndex];
  };

  // Calculate `colSpan` for each cell in the row
  const calculateColSpan = useEventCallback(
    getColspan
      ? (
          rowId: RowId,
          minFirstColumn: integer,
          maxLastColumn: integer,
          columns: ColumnWithWidth[],
        ) => {
          for (let i = minFirstColumn; i < maxLastColumn; i += 1) {
            const cellProps = calculateCellColSpan(
              store.state.colspanMap,
              i,
              rowId,
              minFirstColumn,
              maxLastColumn,
              columns,
              getColspan,
            );
            if (cellProps.colSpan > 1) {
              i += cellProps.colSpan - 1;
            }
          }
        }
      : () => {},
  );

  api.calculateColSpan = calculateColSpan;

  return {
    resetColSpan,
    getCellColSpanInfo,
    calculateColSpan,
  };
}

function calculateCellColSpan(
  lookup: ColspanMap,
  columnIndex: number,
  rowId: RowId,
  minFirstColumnIndex: number,
  maxLastColumnIndex: number,
  columns: ColumnWithWidth[],
  getColspan: ColspanParams['getColspan'],
) {
  const columnsLength = columns.length;
  const column = columns[columnIndex];

  const colSpan = getColspan(rowId, column, columnIndex);

  if (!colSpan || colSpan === 1) {
    setCellColSpanInfo(lookup, rowId, columnIndex, {
      spannedByColSpan: false,
      cellProps: {
        colSpan: 1,
        width: column.computedWidth,
      },
    });
    return { colSpan: 1 };
  }

  let width = column.computedWidth;

  for (let j = 1; j < colSpan; j += 1) {
    const nextColumnIndex = columnIndex + j;
    // Cells should be spanned only within their column section (left-pinned, right-pinned and unpinned).
    if (nextColumnIndex >= minFirstColumnIndex && nextColumnIndex < maxLastColumnIndex) {
      const nextColumn = columns[nextColumnIndex];
      width += nextColumn.computedWidth;

      setCellColSpanInfo(lookup, rowId, columnIndex + j, {
        spannedByColSpan: true,
        rightVisibleCellIndex: Math.min(columnIndex + colSpan, columnsLength - 1),
        leftVisibleCellIndex: columnIndex,
      });
    }

    setCellColSpanInfo(lookup, rowId, columnIndex, {
      spannedByColSpan: false,
      cellProps: { colSpan, width },
    });
  }

  return { colSpan };
}

function setCellColSpanInfo(
  colspanMap: ColspanMap,
  rowId: RowId,
  columnIndex: ColumnIndex,
  cellColSpanInfo: CellColSpanInfo,
) {
  let columnInfo = colspanMap.get(rowId);

  if (!columnInfo) {
    columnInfo = {};
    colspanMap.set(rowId, columnInfo);
  }

  columnInfo[columnIndex] = cellColSpanInfo;
}
