import * as React from 'react';
import { GridColDef } from '../../../models/colDef';
import { GridRowId, GridValidRowModel } from '../../../models/gridRows';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity, GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRenderContextSelector } from '../virtualization/gridVirtualizationSelectors';
import { GridRenderContext } from '../../../models';
import { useGridSelector } from '../../utils/useGridSelector';

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

const EMPTY_STATE = { spannedCells: {}, hiddenCells: {}, hiddenCellOriginMap: {} };
const EMPTY_RANGE = { firstRowIndex: 0, lastRowIndex: 0 };
const skippedFields = new Set(['__check__', '__reorder__']);

function isUninitializedRowContext(renderContext: GridRenderContext) {
  return renderContext.firstRowIndex === 0 && renderContext.lastRowIndex === 0;
}

function isRowRenderContextUpdated(
  prevRenderContext: GridRenderContext,
  renderContext: GridRenderContext,
) {
  return (
    prevRenderContext.firstRowIndex !== renderContext.firstRowIndex ||
    prevRenderContext.lastRowIndex !== renderContext.lastRowIndex
  );
}

function getUnprocessedRange(
  testRange: { firstRowIndex: number; lastRowIndex: number },
  processedRange: { firstRowIndex: number; lastRowIndex: number },
) {
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

export const rowSpanningStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    rowSpanning: EMPTY_STATE,
  };
};

const getCellValue = (
  row: GridValidRowModel,
  colDef: GridColDef,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => {
  if (!row) {
    return null;
  }
  let cellValue = row[colDef.field];
  const valueGetter = colDef.rowSpanValueGetter ?? colDef.valueGetter;
  if (valueGetter) {
    cellValue = valueGetter(cellValue as never, row, colDef, apiRef);
  }
  return cellValue;
};

export const useGridRowSpanning = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'unstable_rowSpanning' | 'pagination' | 'paginationMode'>,
): void => {
  const { range, rows: visibleRows } = useGridVisibleRows(apiRef, props);
  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);
  const colDefs = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const processedRange = React.useRef<{ firstRowIndex: number; lastRowIndex: number }>(EMPTY_RANGE);

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

      if (range === null || isUninitializedRowContext(renderContext)) {
        return;
      }

      const spannedCells = resetState ? {} : { ...apiRef.current.state.rowSpanning.spannedCells };
      const hiddenCells = resetState ? {} : { ...apiRef.current.state.rowSpanning.hiddenCells };
      const hiddenCellOriginMap = resetState
        ? {}
        : { ...apiRef.current.state.rowSpanning.hiddenCellOriginMap };

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
        processedRange.current = {
          firstRowIndex: Math.min(
            processedRange.current.firstRowIndex,
            rangeToProcess.firstRowIndex,
          ),
          lastRowIndex: Math.max(processedRange.current.lastRowIndex, rangeToProcess.lastRowIndex),
        };
      });

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
    [apiRef, props.unstable_rowSpanning, range, renderContext, visibleRows, colDefs],
  );

  const prevRenderContext = React.useRef(renderContext);
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    const firstRender = isFirstRender.current;
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    if (!firstRender && prevRenderContext.current !== renderContext) {
      if (isRowRenderContextUpdated(prevRenderContext.current, renderContext)) {
        updateRowSpanningState(false);
      }
      prevRenderContext.current = renderContext;
      return;
    }
    updateRowSpanningState();
  }, [updateRowSpanningState, renderContext]);
};
