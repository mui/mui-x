import * as React from 'react';
import { GridEventListener } from '../../../models/events';
import { GridColDef } from '../../../models/colDef';
import { GridRowId } from '../../../models/gridRows';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { gridSortedRowIdsSelector } from '../sorting/gridSortingSelector';
import { gridColumnDefinitionsSelector } from '../columns/gridColumnsSelector';

export interface GridRowSpanningState {
  spannedCells: Record<GridRowId, Record<GridColDef['field'], number>>;
  hiddenCells: Record<GridRowId, Record<GridColDef['field'], boolean>>;
}

const EMPTY_STATE = { spannedCells: {}, hiddenCells: {} };

export const rowSpanningStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    rowSpanning: EMPTY_STATE,
  };
};

export const useGridRowSpanning = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'unstable_rowSpanning'>,
): void => {
  const handleSortedRowsSet = React.useCallback<GridEventListener<'sortedRowsSet'>>(() => {
    if (!props.unstable_rowSpanning) {
      return;
    }
    const spannedCells: Record<GridRowId, Record<GridColDef['field'], number>> = {};
    const hiddenCells: Record<GridRowId, Record<GridColDef['field'], boolean>> = {};
    // only span `string` columns for POC
    const filteredSortedRowIds = gridSortedRowIdsSelector(apiRef);
    const colDefs = gridColumnDefinitionsSelector(apiRef);
    colDefs.forEach((colDef) => {
      if (colDef.type !== 'string') {
        return;
      }
      // TODO Perf: Process rendered rows first and lazily process the rest
      filteredSortedRowIds.forEach((rowId, index) => {
        const cellValue = apiRef.current.getRow(rowId)[colDef.field];
        if (cellValue === undefined || hiddenCells[rowId]?.[colDef.field]) {
          return;
        }
        // for each valid cell value, check if subsequent rows have the same value
        let relativeIndex = index + 1;
        let rowSpan = 0;
        while (
          apiRef.current.getRow(filteredSortedRowIds[relativeIndex])?.[colDef.field] === cellValue
        ) {
          if (hiddenCells[filteredSortedRowIds[relativeIndex]]) {
            hiddenCells[filteredSortedRowIds[relativeIndex]][colDef.field] = true;
          } else {
            hiddenCells[filteredSortedRowIds[relativeIndex]] = { [colDef.field]: true };
          }
          relativeIndex += 1;
          rowSpan += 1;
        }

        if (rowSpan > 0) {
          if (spannedCells[rowId]) {
            spannedCells[rowId][colDef.field] = rowSpan + 1;
          } else {
            spannedCells[rowId] = { [colDef.field]: rowSpan + 1 };
          }
        }
      });
    });

    apiRef.current.setState((state) => ({
      ...state,
      rowSpanning: {
        spannedCells,
        hiddenCells,
      },
    }));
  }, [apiRef, props.unstable_rowSpanning]);

  useGridApiEventHandler(apiRef, 'sortedRowsSet', handleSortedRowsSet);
};
