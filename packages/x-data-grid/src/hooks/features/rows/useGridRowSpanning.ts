'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { RowSpanningState } from '@mui/x-virtualizer/models';
import { Rowspan } from '@mui/x-virtualizer/features';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRenderContextSelector } from '../virtualization/gridVirtualizationSelectors';
import { GridRenderContext } from '../../../models';
import type { GridColDef } from '../../../models/colDef';
import type { GridValidRowModel, GridRowEntry } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { getUnprocessedRange, isRowContextInitialized, getCellValue } from './gridRowSpanningUtils';
import { useGridEvent } from '../../utils/useGridEvent';
import { runIf } from '../../../utils/utils';
import { useRunOncePerLoop } from '../../utils/useRunOncePerLoop';

export interface GridRowSpanningState extends RowSpanningState {}

export type RowRange = { firstRowIndex: number; lastRowIndex: number };

const EMPTY_CACHES: RowSpanningState['caches'] = {
  spannedCells: {},
  hiddenCells: {},
  hiddenCellOriginMap: {},
};
const EMPTY_RANGE: RowRange = { firstRowIndex: 0, lastRowIndex: 0 };
const EMPTY_STATE = { caches: EMPTY_CACHES, processedRange: EMPTY_RANGE };

const computeRowSpanningState = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  colDefs: GridColDef[],
  visibleRows: GridRowEntry<GridValidRowModel>[],
  range: RowRange,
  rangeToProcess: RowRange,
  resetState: boolean,
) => {
  const virtualizer = apiRef.current.virtualizer;
  const previousState = resetState ? EMPTY_STATE : Rowspan.selectors.state(virtualizer.store.state);

  const spannedCells = { ...previousState.caches.spannedCells };
  const hiddenCells = { ...previousState.caches.hiddenCells };
  const hiddenCellOriginMap = { ...previousState.caches.hiddenCellOriginMap };

  const processedRange = {
    firstRowIndex: Math.min(
      previousState.processedRange.firstRowIndex,
      rangeToProcess.firstRowIndex,
    ),
    lastRowIndex: Math.max(previousState.processedRange.lastRowIndex, rangeToProcess.lastRowIndex),
  };

  colDefs.forEach((colDef, columnIndex) => {
    for (
      let index = rangeToProcess.firstRowIndex;
      index < rangeToProcess.lastRowIndex;
      index += 1
    ) {
      const row = visibleRows[index];

      if (hiddenCells[row.id]?.[columnIndex]) {
        continue;
      }
      const cellValue = getCellValue(row.model, colDef, apiRef);

      if (cellValue == null) {
        continue;
      }

      let spannedRowId = row.id;
      let spannedRowIndex = index;
      let rowSpan = 0;

      // For first index, also scan in the previous rows to handle the reset state case e.g by sorting
      const backwardsHiddenCells: number[] = [];
      if (index === rangeToProcess.firstRowIndex) {
        let prevIndex = index - 1;
        let prevRowEntry = visibleRows[prevIndex];
        while (
          prevIndex >= range.firstRowIndex &&
          prevRowEntry &&
          getCellValue(prevRowEntry.model, colDef, apiRef) === cellValue
        ) {
          const currentRow = visibleRows[prevIndex + 1];
          if (hiddenCells[currentRow.id]) {
            hiddenCells[currentRow.id][columnIndex] = true;
          } else {
            hiddenCells[currentRow.id] = { [columnIndex]: true };
          }
          backwardsHiddenCells.push(index);
          rowSpan += 1;
          spannedRowId = prevRowEntry.id;
          spannedRowIndex = prevIndex;
          prevIndex -= 1;

          prevRowEntry = visibleRows[prevIndex];
        }
      }

      backwardsHiddenCells.forEach((hiddenCellIndex) => {
        if (hiddenCellOriginMap[hiddenCellIndex]) {
          hiddenCellOriginMap[hiddenCellIndex][columnIndex] = spannedRowIndex;
        } else {
          hiddenCellOriginMap[hiddenCellIndex] = { [columnIndex]: spannedRowIndex };
        }
      });

      // Scan the next rows
      let relativeIndex = index + 1;
      while (
        relativeIndex <= range.lastRowIndex &&
        visibleRows[relativeIndex] &&
        getCellValue(visibleRows[relativeIndex].model, colDef, apiRef) === cellValue
      ) {
        const currentRow = visibleRows[relativeIndex];
        if (hiddenCells[currentRow.id]) {
          hiddenCells[currentRow.id][columnIndex] = true;
        } else {
          hiddenCells[currentRow.id] = { [columnIndex]: true };
        }
        if (hiddenCellOriginMap[relativeIndex]) {
          hiddenCellOriginMap[relativeIndex][columnIndex] = spannedRowIndex;
        } else {
          hiddenCellOriginMap[relativeIndex] = { [columnIndex]: spannedRowIndex };
        }
        relativeIndex += 1;
        rowSpan += 1;
      }

      if (rowSpan > 0) {
        if (spannedCells[spannedRowId]) {
          spannedCells[spannedRowId][columnIndex] = rowSpan + 1;
        } else {
          spannedCells[spannedRowId] = { [columnIndex]: rowSpan + 1 };
        }
      }
    }
  });

  return { caches: { spannedCells, hiddenCells, hiddenCellOriginMap }, processedRange };
};

/**
 * @requires columnsStateInitializer (method) - should be initialized before
 * @requires rowsStateInitializer (method) - should be initialized before
 * @requires filterStateInitializer (method) - should be initialized before
 */
export const rowSpanningStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    rowSpanning: EMPTY_STATE,
  };
};

export const useGridRowSpanning = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'rowSpanning'>,
): void => {
  const { rowSpanning } = props;
  const updateRowSpanningState = React.useCallback(
    (renderContext: GridRenderContext, resetState: boolean = false) => {
      const store = apiRef.current.virtualizer.store;
      const { range, rows: visibleRows } = getVisibleRows(apiRef);
      if (resetState) {
        store.set('rowSpanning', EMPTY_STATE);
      }

      if (range === null || !isRowContextInitialized(renderContext)) {
        return;
      }

      const previousState = resetState ? EMPTY_STATE : Rowspan.selectors.state(store.state);

      const rangeToProcess = getUnprocessedRange(
        {
          firstRowIndex: renderContext.firstRowIndex,
          lastRowIndex: Math.min(
            renderContext.lastRowIndex,
            range.lastRowIndex - range.firstRowIndex + 1,
          ),
        },
        previousState.processedRange,
      );

      if (rangeToProcess === null) {
        return;
      }

      const colDefs = gridVisibleColumnDefinitionsSelector(apiRef);
      const newState = computeRowSpanningState(
        apiRef,
        colDefs,
        visibleRows,
        range,
        rangeToProcess,
        resetState,
      );

      const newSpannedCellsCount = Object.keys(newState.caches.spannedCells).length;
      const newHiddenCellsCount = Object.keys(newState.caches.hiddenCells).length;
      const previousSpannedCellsCount = Object.keys(previousState.caches.spannedCells).length;
      const previousHiddenCellsCount = Object.keys(previousState.caches.hiddenCells).length;

      const shouldUpdateState =
        resetState ||
        newSpannedCellsCount !== previousSpannedCellsCount ||
        newHiddenCellsCount !== previousHiddenCellsCount;
      const hasNoSpannedCells = newSpannedCellsCount === 0 && previousSpannedCellsCount === 0;

      if (!shouldUpdateState || hasNoSpannedCells) {
        return;
      }

      store.set('rowSpanning', newState);
    },
    [apiRef],
  );

  // Reset events trigger a full re-computation of the row spanning state:
  // - The `rowSpanning` prop is updated (feature flag)
  // - The filtering is applied
  // - The sorting is applied
  // - The `paginationModel` is updated
  // - The rows are updated
  const { schedule: deferredUpdateRowSpanningState, cancel } =
    useRunOncePerLoop(updateRowSpanningState);

  const resetRowSpanningState = React.useCallback(() => {
    const renderContext = gridRenderContextSelector(apiRef);
    if (!isRowContextInitialized(renderContext)) {
      return;
    }
    deferredUpdateRowSpanningState(renderContext, true);
  }, [apiRef, deferredUpdateRowSpanningState]);

  useGridEvent(
    apiRef,
    'renderedRowsIntervalChange',
    runIf(rowSpanning, (renderContext: GridRenderContext) => {
      const didHavePendingReset = cancel();
      updateRowSpanningState(renderContext, didHavePendingReset);
    }),
  );

  useGridEvent(apiRef, 'sortedRowsSet', runIf(rowSpanning, resetRowSpanningState));
  useGridEvent(apiRef, 'paginationModelChange', runIf(rowSpanning, resetRowSpanningState));
  useGridEvent(apiRef, 'filteredRowsSet', runIf(rowSpanning, resetRowSpanningState));
  useGridEvent(apiRef, 'columnsChange', runIf(rowSpanning, resetRowSpanningState));
  useGridEvent(apiRef, 'rowExpansionChange', runIf(rowSpanning, resetRowSpanningState));

  React.useEffect(() => {
    const store = apiRef.current.virtualizer?.store;
    if (!store) {
      return;
    }
    if (!rowSpanning) {
      if (store.state.rowSpanning !== EMPTY_STATE) {
        store.set('rowSpanning', EMPTY_STATE);
      }
    } else if (store.state.rowSpanning === EMPTY_STATE) {
      updateRowSpanningState(gridRenderContextSelector(apiRef));
    }
  }, [apiRef, rowSpanning, updateRowSpanningState]);
};
