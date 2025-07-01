'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../internals/constants';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRenderContextSelector } from '../virtualization/gridVirtualizationSelectors';
import { GridRenderContext } from '../../../models';
import type { GridColDef } from '../../../models/colDef';
import type { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridRowId, GridValidRowModel, GridRowEntry } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GRID_CHECKBOX_SELECTION_FIELD } from '../../../colDef/gridCheckboxSelectionColDef';
import { useGridEvent } from '../../utils/useGridEvent';
import { runIf } from '../../../utils/utils';

export interface GridRowSpanningState {
  processedRange: RowRange;
  spannedCells: Record<GridRowId, Record<number, number>>;
  hiddenCells: Record<GridRowId, Record<number, boolean>>;
  /**
   * For each hidden cell, it contains the row index corresponding to the cell that is
   * the origin of the hidden cell. i.e. the cell which is spanned.
   * Used by the virtualization to properly keep the spanned cells in view.
   */
  hiddenCellOriginMap: Record<number, Record<number, number>>;
}

export type RowRange = { firstRowIndex: number; lastRowIndex: number };

const EMPTY_RANGE: RowRange = { firstRowIndex: 0, lastRowIndex: 0 };

const createEmptyState = () => ({
  processedRange: EMPTY_RANGE,
  spannedCells: {},
  hiddenCells: {},
  hiddenCellOriginMap: {},
});

const isEmptyState = ({
  processedRange,
  spannedCells,
  hiddenCells,
  hiddenCellOriginMap,
}: GridRowSpanningState) =>
  processedRange.firstRowIndex === 0 &&
  processedRange.lastRowIndex === 0 &&
  isObjectEmpty(spannedCells) &&
  isObjectEmpty(hiddenCells) &&
  isObjectEmpty(hiddenCellOriginMap);

const skippedFields = new Set([
  GRID_CHECKBOX_SELECTION_FIELD,
  '__reorder__',
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
]);
/**
 * Default number of rows to process during state initialization to avoid flickering.
 * Number `20` is arbitrarily chosen to be large enough to cover most of the cases without
 * compromising performance.
 */
const DEFAULT_ROWS_TO_PROCESS = 20;

const scanAdditionalRange = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  state: GridRowSpanningState,
  columns: GridColDef[],
  rows: GridRowEntry<GridValidRowModel>[],
  totalRange: RowRange,
  rangeToProcess: RowRange,
) => {
  const newState = { ...state };

  let didUpdate = {
    spannedCells: false,
    hiddenCells: false,
    hiddenCellOriginMap: false,
  };

  const write = (
    field: 'spannedCells' | 'hiddenCells' | 'hiddenCellOriginMap',
    rowId: GridRowId,
    columnIndex: number,
    value: any,
  ) => {
    let target = newState[field] as any;
    if (target[rowId]?.[columnIndex] !== value) {
      if (!didUpdate[field]) {
        didUpdate[field] = true;
        newState[field] = { ...(newState[field] as any) };
        target = newState[field] as any;
      }
    }
    target[rowId] ??= {};
    target[rowId][columnIndex] = value;
  };

  columns.forEach((colDef, columnIndex) => {
    if (skippedFields.has(colDef.field)) {
      return;
    }

    for (
      let index = rangeToProcess.firstRowIndex;
      index < rangeToProcess.lastRowIndex;
      index += 1
    ) {
      const row = rows[index];

      if (newState.hiddenCells[row.id]?.[columnIndex]) {
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
        let prevRowEntry = rows[prevIndex];
        while (
          prevIndex >= totalRange.firstRowIndex &&
          prevRowEntry &&
          getCellValue(prevRowEntry.model, colDef, apiRef) === cellValue
        ) {
          const currentRow = rows[prevIndex + 1];
          write('hiddenCells', currentRow.id, columnIndex, true);
          backwardsHiddenCells.push(index);
          rowSpan += 1;
          spannedRowId = prevRowEntry.id;
          spannedRowIndex = prevIndex;
          prevIndex -= 1;

          prevRowEntry = rows[prevIndex];
        }
      }

      backwardsHiddenCells.forEach((hiddenCellIndex) => {
        write('hiddenCellOriginMap', hiddenCellIndex, columnIndex, spannedRowIndex);
      });

      // Scan the next rows
      let relativeIndex = index + 1;
      while (
        relativeIndex <= totalRange.lastRowIndex &&
        rows[relativeIndex] &&
        getCellValue(rows[relativeIndex].model, colDef, apiRef) === cellValue
      ) {
        const currentRow = rows[relativeIndex];
        write('hiddenCells', currentRow.id, columnIndex, true);
        write('hiddenCellOriginMap', relativeIndex, columnIndex, spannedRowIndex);
        relativeIndex += 1;
        rowSpan += 1;
      }

      if (rowSpan > 0) {
        write('spannedCells', spannedRowId, columnIndex, rowSpan + 1);
      }
    }
  });

  newState.processedRange = {
    firstRowIndex: Math.min(state.processedRange.firstRowIndex, rangeToProcess.firstRowIndex),
    lastRowIndex: Math.max(state.processedRange.lastRowIndex, rangeToProcess.lastRowIndex),
  };

  return [
    newState,
    didUpdate.spannedCells || didUpdate.hiddenCells || didUpdate.hiddenCellOriginMap,
  ] as const;
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
      rowSpanning: createEmptyState(),
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
      rowSpanning: createEmptyState(),
    };
  }

  const columns = orderedFields.map((field) => columnsLookup[field!]) as GridColDef[];
  const { range, rows } = getVisibleRows(apiRef);
  const rangeToProcess = {
    firstRowIndex: 0,
    lastRowIndex: Math.min(DEFAULT_ROWS_TO_PROCESS, rows.length),
  };

  const [rowSpanning, _] = scanAdditionalRange(
    apiRef,
    createEmptyState(),
    columns,
    rows,
    range ?? EMPTY_RANGE,
    rangeToProcess,
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
  const updateRowSpanningState = React.useCallback(
    (renderContext: GridRenderContext, resetState: boolean = false) => {
      const { range, rows } = getVisibleRows(apiRef);
      if (range === null || !isRowContextInitialized(renderContext)) {
        return;
      }

      let rowSpanning = apiRef.current.state.rowSpanning;

      if (resetState) {
        rowSpanning = createEmptyState();
      }

      const rangeToProcess = getUnprocessedRange(
        {
          firstRowIndex: renderContext.firstRowIndex,
          lastRowIndex: Math.min(renderContext.lastRowIndex, range.lastRowIndex + 1),
        },
        rowSpanning.processedRange,
      );

      if (rangeToProcess === null) {
        return;
      }

      const columns = gridVisibleColumnDefinitionsSelector(apiRef);

      let didUpdate = false;
      [rowSpanning, didUpdate] = scanAdditionalRange(
        apiRef,
        rowSpanning,
        columns,
        rows,
        range,
        rangeToProcess,
      );

      const shouldUpdateState = resetState || didUpdate;
      const hasNoSpannedCells =
        isObjectEmpty(rowSpanning.spannedCells) &&
        isObjectEmpty(apiRef.current.state.rowSpanning.spannedCells);

      if (!shouldUpdateState || hasNoSpannedCells) {
        return;
      }

      apiRef.current.setState((state) => {
        return {
          ...state,
          rowSpanning,
        };
      });
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
    if (!props.rowSpanning) {
      if (!isEmptyState(apiRef.current.state.rowSpanning)) {
        apiRef.current.setState((state) => ({ ...state, rowSpanning: createEmptyState() }));
      }
    } else {
      const renderContext = gridRenderContextSelector(apiRef);
      if (!isRowContextInitialized(renderContext)) {
        return;
      }
      updateRowSpanningState(renderContext, true);
    }
  }, [apiRef, props.rowSpanning, updateRowSpanningState]);

  useGridEvent(
    apiRef,
    'renderedRowsIntervalChange',
    runIf(props.rowSpanning, updateRowSpanningState),
  );

  useGridEvent(apiRef, 'sortedRowsSet', resetRowSpanningState);
  useGridEvent(apiRef, 'paginationModelChange', resetRowSpanningState);
  useGridEvent(apiRef, 'filteredRowsSet', resetRowSpanningState);
  useGridEvent(apiRef, 'columnsChange', resetRowSpanningState);

  React.useEffect(() => {
    resetRowSpanningState();
  }, [resetRowSpanningState]);
};

function getUnprocessedRange(testRange: RowRange, processedRange: RowRange) {
  if (
    testRange.firstRowIndex >= processedRange.firstRowIndex &&
    testRange.lastRowIndex <= processedRange.lastRowIndex
  ) {
    return null;
  }
  // Overflowing at the end
  // Example: testRange={ firstRowIndex: 10, lastRowIndex: 20 }, processedRange={ firstRowIndex: 0, lastRowIndex: 15 }
  // Unprocessed Range={ firstRowIndex: 16, lastRowIndex: 20 }
  if (
    testRange.firstRowIndex >= processedRange.firstRowIndex &&
    testRange.lastRowIndex > processedRange.lastRowIndex
  ) {
    return { firstRowIndex: processedRange.lastRowIndex, lastRowIndex: testRange.lastRowIndex };
  }
  // Overflowing at the beginning
  // Example: testRange={ firstRowIndex: 0, lastRowIndex: 20 }, processedRange={ firstRowIndex: 16, lastRowIndex: 30 }
  // Unprocessed Range={ firstRowIndex: 0, lastRowIndex: 15 }
  if (
    testRange.firstRowIndex < processedRange.firstRowIndex &&
    testRange.lastRowIndex <= processedRange.lastRowIndex
  ) {
    return {
      firstRowIndex: testRange.firstRowIndex,
      lastRowIndex: processedRange.firstRowIndex - 1,
    };
  }
  // TODO: Should return two ranges handle overflowing at both ends ?
  return testRange;
}

function isRowContextInitialized(renderContext: GridRenderContext) {
  return renderContext.firstRowIndex !== 0 || renderContext.lastRowIndex !== 0;
}

function getCellValue(
  row: GridValidRowModel,
  colDef: GridColDef,
  apiRef: RefObject<GridApiCommunity>,
) {
  if (!row) {
    return null;
  }
  let cellValue = row[colDef.field];
  const valueGetter = colDef.rowSpanValueGetter ?? colDef.valueGetter;
  if (valueGetter) {
    cellValue = valueGetter(cellValue as never, row, colDef, apiRef);
  }
  return cellValue;
}
