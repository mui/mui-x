import type { RefObject } from '@mui/x-internals/types';
import { Rowspan } from '@mui/x-virtualizer';
import { gridFilteredSortedRowIdsSelector } from '../filter/gridFilterSelector';
import type { GridRowId } from '../../../models';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

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
  apiRef: RefObject<GridPrivateApiCommunity>,
  rowId: GridRowId,
  colIndex: number,
  rowSpanScanDirection: 'up' | 'down',
) {
  const rowSpanHiddenCells = Rowspan.selectors.hiddenCells(apiRef.current.virtualizer.store.state);
  if (!rowSpanHiddenCells[rowId]?.[colIndex]) {
    return rowId;
  }
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  // find closest non row spanned cell in the given `rowSpanScanDirection`
  let nextRowIndex =
    filteredSortedRowIds.indexOf(rowId) + (rowSpanScanDirection === 'down' ? 1 : -1);
  while (nextRowIndex >= 0 && nextRowIndex < filteredSortedRowIds.length) {
    const nextRowId = filteredSortedRowIds[nextRowIndex];
    if (!rowSpanHiddenCells[nextRowId]?.[colIndex]) {
      return nextRowId;
    }
    nextRowIndex += rowSpanScanDirection === 'down' ? 1 : -1;
  }
  return rowId;
}
