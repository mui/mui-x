import * as React from 'react';
import { gridFilteredSortedRowIdsSelector } from '../filter/gridFilterSelector';
import { GridColDef, GridRowEntry, GridRowId } from '../../../models';
import { gridRowSpanningHiddenCellsSelector } from '../rows/gridRowSpanningSelectors';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';

export function enrichPageRowsWithPinnedRows(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  rows: GridRowEntry[],
) {
  const pinnedRows = gridPinnedRowsSelector(apiRef) || {};

  return [...(pinnedRows.top || []), ...rows, ...(pinnedRows.bottom || [])];
}

export const getLeftColumnIndex = ({
  currentColIndex,
  firstColIndex,
  lastColIndex,
  isRtl,
}: {
  currentColIndex: number;
  firstColIndex: number;
  lastColIndex: number;
  isRtl: boolean;
}) => {
  if (isRtl) {
    if (currentColIndex < lastColIndex) {
      return currentColIndex + 1;
    }
  } else if (!isRtl) {
    if (currentColIndex > firstColIndex) {
      return currentColIndex - 1;
    }
  }
  return null;
};

export const getRightColumnIndex = ({
  currentColIndex,
  firstColIndex,
  lastColIndex,
  isRtl,
}: {
  currentColIndex: number;
  firstColIndex: number;
  lastColIndex: number;
  isRtl: boolean;
}) => {
  if (isRtl) {
    if (currentColIndex > firstColIndex) {
      return currentColIndex - 1;
    }
  } else if (!isRtl) {
    if (currentColIndex < lastColIndex) {
      return currentColIndex + 1;
    }
  }
  return null;
};

export function findNonRowSpannedCell(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  rowId: GridRowId,
  field: GridColDef['field'],
  rowSpanScanDirection: 'up' | 'down',
) {
  const rowSpanHiddenCells = gridRowSpanningHiddenCellsSelector(apiRef);
  if (!rowSpanHiddenCells[rowId]?.[field]) {
    return rowId;
  }
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  // find closest non row spanned cell in the given `rowSpanScanDirection`
  let nextRowIndex =
    filteredSortedRowIds.indexOf(rowId) + (rowSpanScanDirection === 'down' ? 1 : -1);
  while (nextRowIndex >= 0 && nextRowIndex < filteredSortedRowIds.length) {
    const nextRowId = filteredSortedRowIds[nextRowIndex];
    if (!rowSpanHiddenCells[nextRowId]?.[field]) {
      return nextRowId;
    }
    nextRowIndex += rowSpanScanDirection === 'down' ? 1 : -1;
  }
  return rowId;
}
