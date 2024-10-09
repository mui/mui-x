import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRenderContextSelector } from '../virtualization/gridVirtualizationSelectors';
import { useGridSelector } from '../../utils/useGridSelector';
import type { GridColDef } from '../../../models/colDef';
import type { GridRowId, GridValidRowModel, GridRowEntry } from '../../../models/gridRows';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  getUnprocessedRange,
  isRowRangeUpdated,
  isRowContextInitialized,
  getCellValue,
} from './gridRowSpanningUtils';

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
const skippedFields = new Set(['__check__', '__reorder__', '__detail_panel_toggle__']);
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
      index <= rangeToProcess.lastRowIndex;
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
        const prevRowEntry = visibleRows[prevIndex];
        while (
          prevIndex >= range.firstRowIndex &&
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
  if (props.unstable_rowSpanning) {
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
      lastRowIndex: Math.min(DEFAULT_ROWS_TO_PROCESS - 1, Math.max(rowIds.length - 1, 0)),
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
  }
  return {
    ...state,
    rowSpanning: EMPTY_STATE,
  };
};

export const useGridRowSpanning = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'unstable_rowSpanning' | 'pagination' | 'paginationMode'>,
): void => {
  const { range, rows: visibleRows } = useGridVisibleRows(apiRef, props);
  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);
  const colDefs = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const processedRange = useLazyRef<RowRange, void>(() => {
    return Object.keys(apiRef.current.state.rowSpanning.spannedCells).length > 0
      ? {
          firstRowIndex: 0,
          lastRowIndex: Math.min(
            DEFAULT_ROWS_TO_PROCESS - 1,
            Math.max(apiRef.current.state.rows.dataRowIds.length - 1, 0),
          ),
        }
      : EMPTY_RANGE;
  });
  const lastRange = React.useRef<RowRange>(EMPTY_RANGE);

  const updateRowSpanningState = React.useCallback(
    // A reset needs to occur when:
    // - The `unstable_rowSpanning` prop is updated (feature flag)
    // - The filtering is applied
    // - The sorting is applied
    // - The `paginationModel` is updated
    // - The rows are updated
    (resetState: boolean = true) => {
      if (!props.unstable_rowSpanning) {
        if (apiRef.current.state.rowSpanning !== EMPTY_STATE) {
          apiRef.current.setState((state) => ({ ...state, rowSpanning: EMPTY_STATE }));
        }
        return;
      }

      if (range === null || !isRowContextInitialized(renderContext)) {
        return;
      }

      if (resetState) {
        processedRange.current = EMPTY_RANGE;
      }

      const rangeToProcess = getUnprocessedRange(
        {
          firstRowIndex: renderContext.firstRowIndex,
          lastRowIndex: renderContext.lastRowIndex - 1,
        },
        processedRange.current,
      );

      if (rangeToProcess === null) {
        return;
      }

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

      if (!shouldUpdateState) {
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
    [
      apiRef,
      props.unstable_rowSpanning,
      range,
      renderContext,
      visibleRows,
      colDefs,
      processedRange,
    ],
  );

  const prevRenderContext = React.useRef(renderContext);
  const isFirstRender = React.useRef(true);
  const shouldResetState = React.useRef(false);
  React.useEffect(() => {
    const firstRender = isFirstRender.current;
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    if (range && lastRange.current && isRowRangeUpdated(range, lastRange.current)) {
      lastRange.current = range;
      shouldResetState.current = true;
    }
    if (!firstRender && prevRenderContext.current !== renderContext) {
      if (isRowRangeUpdated(prevRenderContext.current, renderContext)) {
        updateRowSpanningState(shouldResetState.current);
        shouldResetState.current = false;
      }
      prevRenderContext.current = renderContext;
      return;
    }
    updateRowSpanningState();
  }, [updateRowSpanningState, renderContext, range, lastRange]);
};
