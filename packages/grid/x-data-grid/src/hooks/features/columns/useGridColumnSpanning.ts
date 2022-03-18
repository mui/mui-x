import React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridColumnIndex, GridCellColSpanInfo } from '../../../models/gridColumnSpanning';
import { GridRowId } from '../../../models/gridRows';
import { GridColumnSpanning } from '../../../models/api/gridColumnSpanning';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { GridCellParams } from '../../../models/params/gridCellParams';
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

  const getCellColSpanInfo = React.useCallback<GridColumnSpanning['unstable_getCellColSpanInfo']>(
    (rowId, columnIndex) => {
      return lookup.current[rowId]?.[columnIndex];
    },
    [],
  );

  // Calculate `colSpan` for the cell.
  const calculateCellColSpan = React.useCallback(
    (params: {
      columnIndex: number;
      rowId: GridRowId;
      cellParams: GridCellParams;
      minFirstColumnIndex: number;
      maxLastColumnIndex: number;
    }) => {
      const { columnIndex, rowId, cellParams, minFirstColumnIndex, maxLastColumnIndex } = params;
      const visibleColumns = apiRef.current.getVisibleColumns();
      const columnsLength = visibleColumns.length;
      const column = visibleColumns[columnIndex];

      let width = column.computedWidth;

      let colSpan =
        typeof column.colSpan === 'function' ? column.colSpan(cellParams) : column.colSpan;

      if (typeof colSpan === 'undefined') {
        colSpan = 1;
      }

      // Attributes used by `useGridColumnResize` to update column width during resizing.
      // This makes resizing smooth even for cells with colspan > 1.
      const dataColSpanAttributes: Record<string, string> = {};

      if (colSpan > 1) {
        for (let j = 1; j < colSpan; j += 1) {
          const nextColumnIndex = columnIndex + j;
          // Cells should be spanned only within their column section (left-pinned, right-pinned and unpinned).
          if (nextColumnIndex >= minFirstColumnIndex && nextColumnIndex < maxLastColumnIndex) {
            const nextColumn = visibleColumns[nextColumnIndex];
            width += nextColumn.computedWidth;

            dataColSpanAttributes[
              /**
               * `.toLowerCase()` is used to avoid React warning when using camelCase field name.
               * querySelectorAll() still works when querying with camelCase field name.
               */
              `data-colspan-allocates-field-${nextColumn.field.toLowerCase()}`
            ] = '1';

            setCellColSpanInfo(rowId, columnIndex + j, {
              collapsedByColSpan: true,
              rightVisibleCellIndex: Math.min(columnIndex + colSpan, columnsLength - 1),
              leftVisibleCellIndex: columnIndex,
            });
          }
        }
      }

      setCellColSpanInfo(rowId, columnIndex, {
        collapsedByColSpan: false,
        cellProps: {
          colSpan,
          width,
          other: dataColSpanAttributes,
        },
      });

      return {
        colSpan,
      };
    },
    [apiRef, setCellColSpanInfo],
  );
  // Calculate `colSpan` for each cell in the row
  const calculateColSpan = React.useCallback<GridColumnSpanning['unstable_calculateColSpan']>(
    ({ rowId, minFirstColumn, maxLastColumn }) => {
      const visibleColumns = apiRef.current.getVisibleColumns();

      for (let i = minFirstColumn; i < maxLastColumn; i += 1) {
        const column = visibleColumns[i];
        const cellProps = calculateCellColSpan({
          columnIndex: i,
          rowId,
          minFirstColumnIndex: minFirstColumn,
          maxLastColumnIndex: maxLastColumn,
          cellParams: apiRef.current.getCellParams(rowId, column.field),
        });
        if (cellProps.colSpan > 1) {
          i += cellProps.colSpan - 1;
        }
      }
    },
    [apiRef, calculateCellColSpan],
  );

  const columnSpanningApi: GridColumnSpanning = {
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
