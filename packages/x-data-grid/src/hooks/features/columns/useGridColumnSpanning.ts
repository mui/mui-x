import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridColumnIndex, GridCellColSpanInfo } from '../../../models/gridColumnSpanning';
import { GridRowId } from '../../../models/gridRows';
import {
  GridColumnSpanningApi,
  GridColumnSpanningPrivateApi,
} from '../../../models/api/gridColumnSpanning';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStateColDef } from '../../../models/colDef/gridColDef';

type ColSpanLookup = Record<GridRowId, Record<GridColumnIndex, GridCellColSpanInfo>>;

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export const useGridColumnSpanning = (apiRef: React.MutableRefObject<GridPrivateApiCommunity>) => {
  const lookup = React.useRef<ColSpanLookup>({});

  const getCellColSpanInfo: GridColumnSpanningApi['unstable_getCellColSpanInfo'] = (
    rowId,
    columnIndex,
  ) => {
    return lookup.current[rowId]?.[columnIndex];
  };

  const resetColSpan: GridColumnSpanningPrivateApi['resetColSpan'] = () => {
    lookup.current = {};
  };

  // Calculate `colSpan` for each cell in the row
  const calculateColSpan = React.useCallback<GridColumnSpanningPrivateApi['calculateColSpan']>(
    ({ rowId, minFirstColumn, maxLastColumn, columns }) => {
      for (let i = minFirstColumn; i < maxLastColumn; i += 1) {
        const cellProps = calculateCellColSpan({
          apiRef,
          lookup: lookup.current,
          columnIndex: i,
          rowId,
          minFirstColumnIndex: minFirstColumn,
          maxLastColumnIndex: maxLastColumn,
          columns,
        });
        if (cellProps.colSpan > 1) {
          i += cellProps.colSpan - 1;
        }
      }
    },
    [apiRef],
  );

  const columnSpanningPublicApi: GridColumnSpanningApi = {
    unstable_getCellColSpanInfo: getCellColSpanInfo,
  };

  const columnSpanningPrivateApi: GridColumnSpanningPrivateApi = {
    resetColSpan,
    calculateColSpan,
  };

  useGridApiMethod(apiRef, columnSpanningPublicApi, 'public');
  useGridApiMethod(apiRef, columnSpanningPrivateApi, 'private');

  useGridApiEventHandler(apiRef, 'columnOrderChange', resetColSpan);
};

function calculateCellColSpan(params: {
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>;
  lookup: ColSpanLookup;
  columnIndex: number;
  rowId: GridRowId;
  minFirstColumnIndex: number;
  maxLastColumnIndex: number;
  columns: GridStateColDef[];
}) {
  const { apiRef, lookup, columnIndex, rowId, minFirstColumnIndex, maxLastColumnIndex, columns } =
    params;

  const columnsLength = columns.length;
  const column = columns[columnIndex];
  const row = apiRef.current.getRow(rowId);
  const value = apiRef.current.getRowValue(row, column);

  const colSpan =
    typeof column.colSpan === 'function'
      ? column.colSpan(value, row, column, apiRef)
      : column.colSpan;

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
  lookup: ColSpanLookup,
  rowId: GridRowId,
  columnIndex: GridColumnIndex,
  cellColSpanInfo: GridCellColSpanInfo,
) {
  if (!lookup[rowId]) {
    lookup[rowId] = {};
  }

  lookup[rowId][columnIndex] = cellColSpanInfo;
}
