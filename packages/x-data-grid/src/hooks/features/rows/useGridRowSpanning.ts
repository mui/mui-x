import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../internals/constants';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRenderContextSelector } from '../virtualization/gridVirtualizationSelectors';
import { GridRenderContext } from '../../../models';
import type { GridColDef } from '../../../models/colDef';
import type { GridRowId, GridValidRowModel, GridRowEntry } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { getUnprocessedRange, isRowContextInitialized, getCellValue } from './gridRowSpanningUtils';
import { GRID_CHECKBOX_SELECTION_FIELD } from '../../../colDef/gridCheckboxSelectionColDef';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { runIf } from '../../../utils/utils';

export interface GridRowSpanningState {
  spannedCells: Record<GridRowId, Record<GridColDef['field'], number>>;
  hiddenCells: Record<GridRowId, Record<GridColDef['field'], boolean>>;
  /**
   * For each hidden cell, it contains the row index corresponding to the cell that is
   * the origin of the hidden cell. i.e. the cell which is spanned.
   * Used by the virtualization to properly keep the spanned cells in view.
   */
  hiddenCellOriginMap: Record<number, Record<GridColDef['field'], number>>;
}

export type RowRange = { firstRowIndex: number; lastRowIndex: number };

const EMPTY_STATE = { spannedCells: {}, hiddenCells: {}, hiddenCellOriginMap: {} };
const EMPTY_RANGE: RowRange = { firstRowIndex: 0, lastRowIndex: 0 };
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

const computeRowSpanningState = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  colDefs: GridColDef[],
  visibleRows: GridRowEntry<GridValidRowModel>[],
  range: RowRange,
  rangeToProcess: RowRange,
  resetState: boolean,
  processedRange: RowRange,
) => {
  const spannedCells = resetState ? {} : { ...apiRef.current.state.rowSpanning.spannedCells };
  const hiddenCells = resetState ? {} : { ...apiRef.current.state.rowSpanning.hiddenCells };
  const hiddenCellOriginMap = resetState
    ? {}
    : { ...apiRef.current.state.rowSpanning.hiddenCellOriginMap };

  if (resetState) {
    processedRange = EMPTY_RANGE;
  }

  colDefs.forEach((colDef) => {
    if (skippedFields.has(colDef.field)) {
      return;
    }

    for (
      let index = rangeToProcess.firstRowIndex;
      index < rangeToProcess.lastRowIndex;
      index += 1
    ) {
      const row = visibleRows[index];

      if (hiddenCells[row.id]?.[colDef.field]) {
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
            hiddenCells[currentRow.id][colDef.field] = true;
          } else {
            hiddenCells[currentRow.id] = { [colDef.field]: true };
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
          hiddenCellOriginMap[hiddenCellIndex][colDef.field] = spannedRowIndex;
        } else {
          hiddenCellOriginMap[hiddenCellIndex] = { [colDef.field]: spannedRowIndex };
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
          hiddenCells[currentRow.id][colDef.field] = true;
        } else {
          hiddenCells[currentRow.id] = { [colDef.field]: true };
        }
        if (hiddenCellOriginMap[relativeIndex]) {
          hiddenCellOriginMap[relativeIndex][colDef.field] = spannedRowIndex;
        } else {
          hiddenCellOriginMap[relativeIndex] = { [colDef.field]: spannedRowIndex };
        }
        relativeIndex += 1;
        rowSpan += 1;
      }

      if (rowSpan > 0) {
        if (spannedCells[spannedRowId]) {
          spannedCells[spannedRowId][colDef.field] = rowSpan + 1;
        } else {
          spannedCells[spannedRowId] = { [colDef.field]: rowSpan + 1 };
        }
      }
    }
    processedRange = {
      firstRowIndex: Math.min(processedRange.firstRowIndex, rangeToProcess.firstRowIndex),
      lastRowIndex: Math.max(processedRange.lastRowIndex, rangeToProcess.lastRowIndex),
    };
  });
  return { spannedCells, hiddenCells, hiddenCellOriginMap, processedRange };
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
  const rangeToProcess = {
    firstRowIndex: 0,
    lastRowIndex: Math.min(DEFAULT_ROWS_TO_PROCESS, Math.max(rowIds.length, 0)),
  };
  const rows = rowIds.map((id) => ({
    id,
    model: dataRowIdToModelLookup[id!],
  })) as GridRowEntry<GridValidRowModel>[];
  const colDefs = orderedFields.map((field) => columnsLookup[field!]) as GridColDef[];
  const { spannedCells, hiddenCells, hiddenCellOriginMap } = computeRowSpanningState(
    apiRef,
    colDefs,
    rows,
    rangeToProcess,
    rangeToProcess,
    true,
    EMPTY_RANGE,
  );

  return {
    ...state,
    rowSpanning: {
      spannedCells,
      hiddenCells,
      hiddenCellOriginMap,
    },
  };
};

export const useGridRowSpanning = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'rowSpanning' | 'pagination' | 'paginationMode'>,
): void => {
  const processedRange = useLazyRef<RowRange, void>(() => {
    return Object.keys(apiRef.current.state.rowSpanning.spannedCells).length > 0
      ? {
          firstRowIndex: 0,
          lastRowIndex: Math.min(
            DEFAULT_ROWS_TO_PROCESS,
            Math.max(apiRef.current.state.rows.dataRowIds.length, 0),
          ),
        }
      : EMPTY_RANGE;
  });

  const updateRowSpanningState = React.useCallback(
    (renderContext: GridRenderContext, resetState: boolean = false) => {
      const { range, rows: visibleRows } = getVisibleRows(apiRef, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });
      if (range === null || !isRowContextInitialized(renderContext)) {
        return;
      }

      if (resetState) {
        processedRange.current = EMPTY_RANGE;
      }

      const rangeToProcess = getUnprocessedRange(
        {
          firstRowIndex: renderContext.firstRowIndex,
          lastRowIndex: Math.min(renderContext.lastRowIndex, range.lastRowIndex + 1),
        },
        processedRange.current,
      );

      if (rangeToProcess === null) {
        return;
      }

      const colDefs = gridVisibleColumnDefinitionsSelector(apiRef);
      const {
        spannedCells,
        hiddenCells,
        hiddenCellOriginMap,
        processedRange: newProcessedRange,
      } = computeRowSpanningState(
        apiRef,
        colDefs,
        visibleRows,
        range,
        rangeToProcess,
        resetState,
        processedRange.current,
      );

      processedRange.current = newProcessedRange;

      const newSpannedCellsCount = Object.keys(spannedCells).length;
      const newHiddenCellsCount = Object.keys(hiddenCells).length;
      const currentSpannedCellsCount = Object.keys(
        apiRef.current.state.rowSpanning.spannedCells,
      ).length;
      const currentHiddenCellsCount = Object.keys(
        apiRef.current.state.rowSpanning.hiddenCells,
      ).length;

      const shouldUpdateState =
        resetState ||
        newSpannedCellsCount !== currentSpannedCellsCount ||
        newHiddenCellsCount !== currentHiddenCellsCount;
      const hasNoSpannedCells = newSpannedCellsCount === 0 && currentSpannedCellsCount === 0;

      if (!shouldUpdateState || hasNoSpannedCells) {
        return;
      }

      apiRef.current.setState((state) => {
        return {
          ...state,
          rowSpanning: {
            spannedCells,
            hiddenCells,
            hiddenCellOriginMap,
          },
        };
      });
    },
    [apiRef, processedRange, props.pagination, props.paginationMode],
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

  useGridApiEventHandler(
    apiRef,
    'renderedRowsIntervalChange',
    runIf(props.rowSpanning, updateRowSpanningState),
  );

  useGridApiEventHandler(apiRef, 'sortedRowsSet', runIf(props.rowSpanning, resetRowSpanningState));
  useGridApiEventHandler(
    apiRef,
    'paginationModelChange',
    runIf(props.rowSpanning, resetRowSpanningState),
  );
  useGridApiEventHandler(
    apiRef,
    'filteredRowsSet',
    runIf(props.rowSpanning, resetRowSpanningState),
  );
  useGridApiEventHandler(apiRef, 'columnsChange', runIf(props.rowSpanning, resetRowSpanningState));

  React.useEffect(() => {
    if (!props.rowSpanning) {
      if (apiRef.current.state.rowSpanning !== EMPTY_STATE) {
        apiRef.current.setState((state) => ({ ...state, rowSpanning: EMPTY_STATE }));
      }
    } else if (apiRef.current.state.rowSpanning === EMPTY_STATE) {
      resetRowSpanningState();
    }
  }, [apiRef, resetRowSpanningState, props.rowSpanning]);
};
