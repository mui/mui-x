'use client';
import type { RefObject } from '@mui/x-internals/types';
import { useGridSelector } from '@mui/x-data-grid';
import type { GridRowId } from '@mui/x-data-grid';
import { objectShallowCompare } from '@mui/x-data-grid/internals';
import type { GridKeyboardReorderCellDescription } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import {
  getKeyboardReorderDescriptionId,
  gridColumnKeyboardReorderDescribedSelector,
  gridCellKeyboardReorderDescribedStepsSelector,
} from './keyboardReorderUtils';
import type { KeyboardReorderDescriptionKind } from './keyboardReorderUtils';

/**
 * Returns the text that describes the reorder keys of rows or columns.
 * An empty text turns the description off.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {KeyboardReorderDescriptionKind} kind Whether the text describes rows or columns.
 * @returns {string} The text.
 */
export function getKeyboardReorderDescriptionText(
  apiRef: RefObject<GridPrivateApiPro>,
  kind: KeyboardReorderDescriptionKind,
): string {
  return apiRef.current.getLocaleText(
    kind === 'row' ? 'rowReorderingKeyboardDescription' : 'columnReorderingKeyboardDescription',
  )();
}

function getDescriptionId(
  apiRef: RefObject<GridPrivateApiPro>,
  kind: KeyboardReorderDescriptionKind,
) {
  return getKeyboardReorderDescriptionText(apiRef, kind)
    ? getKeyboardReorderDescriptionId(apiRef, kind)
    : undefined;
}

/**
 * Pro implementation of the `useKeyboardReorderCellDescription` configuration hook.
 * @param {GridRowId} rowId The row id.
 * @returns {GridKeyboardReorderCellDescription | null} The cell of the row that describes the reorder keys, and its description.
 */
export const useKeyboardReorderCellDescription = (
  rowId: GridRowId,
): GridKeyboardReorderCellDescription | null => {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  // The locale texts stay out of the selector arguments: when the arguments change,
  // `useGridSelector` can keep the stale value in React 18 Strict Mode.
  const steps = useGridSelector(
    apiRef,
    gridCellKeyboardReorderDescribedStepsSelector,
    {
      rowId,
      rowReordering: rootProps.rowReordering,
      isRowReorderable: rootProps.isRowReorderable,
      disableColumnReorder: rootProps.disableColumnReorder,
    },
    objectShallowCompare,
  );
  if (!steps) {
    return null;
  }

  const describedBy = [
    steps.row ? getDescriptionId(apiRef, 'row') : undefined,
    steps.column ? getDescriptionId(apiRef, 'column') : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  return describedBy ? { field: steps.field, describedBy } : null;
};

/**
 * Pro implementation of the `useKeyboardReorderColumnHeaderDescribedBy` configuration hook.
 * @param {string} field The column field.
 * @returns {string | undefined} The id of the node that describes the reorder keys.
 */
export const useKeyboardReorderColumnHeaderDescribedBy = (field: string): string | undefined => {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const isDescribed = useGridSelector(apiRef, gridColumnKeyboardReorderDescribedSelector, {
    field,
    disableColumnReorder: rootProps.disableColumnReorder,
  });
  return isDescribed ? getDescriptionId(apiRef, 'column') : undefined;
};
