import * as React from 'react';
import type { GridRenderContext } from '../../../models';
import type { GridValidRowModel } from '../../../models/gridRows';
import type { GridColDef } from '../../../models/colDef';
import type { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import type { RowRange } from './useGridRowSpanning';

export function getUnprocessedRange(testRange: RowRange, processedRange: RowRange) {
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

export function isRowContextInitialized(renderContext: GridRenderContext) {
  return renderContext.firstRowIndex !== 0 || renderContext.lastRowIndex !== 0;
}

export function isRowRangeUpdated(range1: RowRange, range2: RowRange) {
  return (
    range1.firstRowIndex !== range2.firstRowIndex || range1.lastRowIndex !== range2.lastRowIndex
  );
}

export const getCellValue = (
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
