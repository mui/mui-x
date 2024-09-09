import * as React from 'react';
import { GridRenderContext } from '../../../models';
import { GridValidRowModel } from '../../../models/gridRows';
import { GridColDef } from '../../../models/colDef';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export function getUnprocessedRange(
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

export function isUninitializedRowContext(renderContext: GridRenderContext) {
  return renderContext.firstRowIndex === 0 && renderContext.lastRowIndex === 0;
}

export function isRowRenderContextUpdated(
  prevRenderContext: GridRenderContext,
  renderContext: GridRenderContext,
) {
  return (
    prevRenderContext.firstRowIndex !== renderContext.firstRowIndex ||
    prevRenderContext.lastRowIndex !== renderContext.lastRowIndex
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
