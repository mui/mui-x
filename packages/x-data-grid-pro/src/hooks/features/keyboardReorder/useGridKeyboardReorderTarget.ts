'use client';
import { useGridSelector } from '@mui/x-data-grid';
import type { GridRowId } from '@mui/x-data-grid';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import {
  gridColumnKeyboardReorderTargetSelector,
  gridRowKeyboardReorderTargetSelector,
} from './keyboardReorderUtils';

/**
 * Pro implementation of the `useIsRowKeyboardReorderTarget` configuration hook.
 * @param {GridRowId} rowId The row id.
 * @returns {boolean} `true` when a keyboard press would move the row.
 */
export const useIsRowKeyboardReorderTarget = (rowId: GridRowId): boolean => {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  return useGridSelector(apiRef, gridRowKeyboardReorderTargetSelector, {
    rowId,
    rowReordering: rootProps.rowReordering,
    isRowReorderable: rootProps.isRowReorderable,
  });
};

/**
 * Pro implementation of the `useIsColumnKeyboardReorderTarget` configuration hook.
 * @param {string} field The column field.
 * @returns {boolean} `true` when a keyboard press would move the column.
 */
export const useIsColumnKeyboardReorderTarget = (field: string): boolean => {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  return useGridSelector(apiRef, gridColumnKeyboardReorderTargetSelector, {
    field,
    disableColumnReorder: rootProps.disableColumnReorder,
  });
};
