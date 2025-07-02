'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import useLazyRef from '@mui/utils/useLazyRef';
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
import { gridPageSizeSelector } from '../pagination';
import { gridDataRowIdsSelector } from './gridRowsSelector';

export interface GridRowSpanningState extends RowSpanningState {}

export type RowRange = { firstRowIndex: number; lastRowIndex: number };

const EMPTY_CACHES: RowSpanningState['caches'] = {
  spannedCells: {},
  hiddenCells: {},
  hiddenCellOriginMap: {},
};
const EMPTY_RANGE: RowRange = { firstRowIndex: 0, lastRowIndex: 0 };
const EMPTY_STATE = { caches: EMPTY_CACHES, processedRange: EMPTY_RANGE };

/**
 * Default number of rows to process during state initialization to avoid flickering.
 * Number `20` is arbitrarily chosen to be large enough to cover most of the cases without
 * compromising performance.
 */
const DEFAULT_ROWS_TO_PROCESS = 20;

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

const getInitialRangeToProcess = (
  props: Pick<DataGridProcessedProps, 'pagination'>,
  apiRef: React.RefObject<GridPrivateApiCommunity>,
) => {
  const rowCount = gridDataRowIdsSelector(apiRef).length;

  if (props.pagination) {
    const pageSize = gridPageSizeSelector(apiRef);
    let paginationLastRowIndex = DEFAULT_ROWS_TO_PROCESS;
    if (pageSize > 0) {
      paginationLastRowIndex = pageSize - 1;
    }
    return {
      firstRowIndex: 0,
      lastRowIndex: Math.min(paginationLastRowIndex, rowCount),
    };
  }

  return {
    firstRowIndex: 0,
    lastRowIndex: Math.min(DEFAULT_ROWS_TO_PROCESS, rowCount),
  };
};

/**
 * @requires columnsStateInitializer (method) - should be initialized before
 * @requires rowsStateInitializer (method) - should be initialized before
 * @requires filterStateInitializer (method) - should be initialized before
 */
export const rowSpanningStateInitializer: GridStateInitializer = (state, props, apiRef) => {
  if (!props.rowSpanning) {
    return {
      ...state,
      rowSpanning: EMPTY_STATE,
    };
  }

  const rowIds = state.rows!.dataRowIds || [];
  const orderedFields = state.columns!.orderedFields || [];
  const dataRowIdToModelLookup = state.rows!.dataRowIdToModelLookup;
  const columnsLookup = state.columns!.lookup;
  const isFilteringPending =
    Boolean(state.filter!.filterModel!.items!.length) ||
    Boolean(state.filter!.filterModel!.quickFilterValues?.length);

  if (
    !rowIds.length ||
    !orderedFields.length ||
    !dataRowIdToModelLookup ||
    !columnsLookup ||
    isFilteringPending
  ) {
    return {
      ...state,
      rowSpanning: EMPTY_STATE,
    };
  }

  const rangeToProcess = getInitialRangeToProcess(props, apiRef);
  const rows = rowIds.map((id) => ({
    id,
    model: dataRowIdToModelLookup[id!],
  })) as GridRowEntry<GridValidRowModel>[];
  const colDefs = orderedFields.map((field) => columnsLookup[field!]) as GridColDef[];

  const rowSpanning = computeRowSpanningState(
    apiRef,
    colDefs,
    rows,
    rangeToProcess,
    rangeToProcess,
    true,
  );

  return {
    ...state,
    rowSpanning,
  };
};

export const useGridRowSpanning = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'rowSpanning' | 'pagination' | 'paginationMode'>,
): void => {
  const store = apiRef.current.virtualizer.store;

  const updateRowSpanningState = React.useCallback(
    (renderContext: GridRenderContext, resetState: boolean = false) => {
      const { range, rows: visibleRows } = getVisibleRows(apiRef, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });
      if (range === null || !isRowContextInitialized(renderContext)) {
        return;
      }

      const previousState = resetState ? EMPTY_STATE : Rowspan.selectors.state(store.state);

      const rangeToProcess = getUnprocessedRange(
        {
          firstRowIndex: renderContext.firstRowIndex,
          lastRowIndex: Math.min(renderContext.lastRowIndex, range.lastRowIndex + 1),
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
    [apiRef, props.pagination, props.paginationMode],
  );

  // Reset events trigger a full re-computation of the row spanning state:
  // - The `unstable_rowSpanning` prop is updated (feature flag)
  // - The filtering is applied
  // - The sorting is applied
  // - The `paginationModel` is updated
  // - The rows are updated
  const resetRowSpanningState = React.useCallback(() => {
    const renderContext = gridRenderContextSelector(apiRef);
    if (!isRowContextInitialized(renderContext)) {
      return;
    }
    updateRowSpanningState(renderContext, true);
  }, [apiRef, updateRowSpanningState]);

  useGridEvent(
    apiRef,
    'renderedRowsIntervalChange',
    runIf(props.rowSpanning, updateRowSpanningState),
  );

  useGridEvent(apiRef, 'sortedRowsSet', runIf(props.rowSpanning, resetRowSpanningState));
  useGridEvent(apiRef, 'paginationModelChange', runIf(props.rowSpanning, resetRowSpanningState));
  useGridEvent(apiRef, 'filteredRowsSet', runIf(props.rowSpanning, resetRowSpanningState));
  useGridEvent(apiRef, 'columnsChange', runIf(props.rowSpanning, resetRowSpanningState));

  React.useEffect(() => {
    if (!props.rowSpanning) {
      if (store.state.rowSpanning !== EMPTY_STATE) {
        store.set('rowSpanning', EMPTY_STATE);
      }
    } else if (store.state.rowSpanning.caches === EMPTY_CACHES) {
      resetRowSpanningState();
    }
  }, [apiRef, resetRowSpanningState, props.rowSpanning]);
};
