import React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridColumnIndex, GridCellColSpanInfo } from '../../../models/gridColumnSpanning';
import { GridRowId } from '../../../models/gridRows';
import { GridColumnSpanningApi } from '../../../models/api/gridColumnSpanning';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export const useGridColumnSpanning = (apiRef: React.MutableRefObject<GridApiCommunity>) => {
  const lookup = React.useRef<Record<GridRowId, Record<GridColumnIndex, GridCellColSpanInfo>>>({});

  const setCellColSpanInfo = React.useCallback(
    (rowId: GridRowId, columnIndex: GridColumnIndex, cellColSpanInfo: GridCellColSpanInfo) => {
      const sizes = lookup.current;
      if (!sizes[rowId]) {
        sizes[rowId] = {};
      }

      sizes[rowId][columnIndex] = cellColSpanInfo;
    },
    [],
  );

  const getCellColSpanInfo = React.useCallback<
    GridColumnSpanningApi['unstable_getCellColSpanInfo']
  >((rowId, columnIndex) => {
    return lookup.current[rowId]?.[columnIndex];
  }, []);

  // Calculate `colSpan` for the cell.
  const calculateCellColSpan = React.useCallback(
    (params: {
      columnIndex: number;
      rowId: GridRowId;
      minFirstColumnIndex: number;
      maxLastColumnIndex: number;
    }) => {
      const { columnIndex, rowId, minFirstColumnIndex, maxLastColumnIndex } = params;
      const visibleColumns = apiRef.current.getVisibleColumns();
      const columnsLength = visibleColumns.length;
      const column = visibleColumns[columnIndex];

      const colSpan =
        typeof column.colSpan === 'function'
          ? column.colSpan(apiRef.current.getCellParams(rowId, column.field))
          : column.colSpan;

      if (!colSpan || colSpan === 1) {
        setCellColSpanInfo(rowId, columnIndex, {
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
          const nextColumn = visibleColumns[nextColumnIndex];
          width += nextColumn.computedWidth;

          setCellColSpanInfo(rowId, columnIndex + j, {
            spannedByColSpan: true,
            rightVisibleCellIndex: Math.min(columnIndex + colSpan, columnsLength - 1),
            leftVisibleCellIndex: columnIndex,
          });
        }

        setCellColSpanInfo(rowId, columnIndex, {
          spannedByColSpan: false,
          cellProps: { colSpan, width },
        });
      }

      return { colSpan };
    },
    [apiRef, setCellColSpanInfo],
  );

  // Calculate `colSpan` for each cell in the row
  const calculateColSpan = React.useCallback<GridColumnSpanningApi['unstable_calculateColSpan']>(
    ({ rowId, minFirstColumn, maxLastColumn }) => {
      for (let i = minFirstColumn; i < maxLastColumn; i += 1) {
        const cellProps = calculateCellColSpan({
          columnIndex: i,
          rowId,
          minFirstColumnIndex: minFirstColumn,
          maxLastColumnIndex: maxLastColumn,
        });
        if (cellProps.colSpan > 1) {
          i += cellProps.colSpan - 1;
        }
      }
    },
    [calculateCellColSpan],
  );

  const columnSpanningApi: GridColumnSpanningApi = {
    unstable_getCellColSpanInfo: getCellColSpanInfo,
    unstable_calculateColSpan: calculateColSpan,
  };

  useGridApiMethod(apiRef, columnSpanningApi, 'GridColumnSpanningAPI');

  const handleColumnReorderChange = React.useCallback(() => {
    // `colSpan` needs to be recalculated after column reordering
    lookup.current = {};
  }, []);

  useGridApiEventHandler(apiRef, GridEvents.columnOrderChange, handleColumnReorderChange);
};
