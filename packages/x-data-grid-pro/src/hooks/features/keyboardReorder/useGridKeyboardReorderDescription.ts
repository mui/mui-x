'use client';
import type { RefObject } from '@mui/x-internals/types';
import { useGridSelector } from '@mui/x-data-grid';
import type { GridRowId } from '@mui/x-data-grid';
import { objectShallowCompare } from '@mui/x-data-grid/internals';
import type { GridKeyboardReorderCellDescription } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import {
  getKeyboardReorderDescriptionId,
  gridColumnKeyboardReorderDescribedSelector,
  gridCellKeyboardReorderDescribedStepsSelector,
} from './keyboardReorderUtils';
import type { KeyboardReorderDescriptionKind } from './keyboardReorderUtils';

type NavigatorWithUserAgentData = Navigator & { userAgentData?: { platform: string } };

// Apple keyboards label `Alt` as `Option`.
// The grid doesn't render on the server, so reading `navigator` during render can't break the hydration.
function getModifierKey(): 'Alt' | 'Option' {
  if (typeof navigator === 'undefined') {
    return 'Alt';
  }
  // `userAgentData` is only in Chromium browsers. iPadOS reports `MacIntel` in `platform`.
  const platform =
    (navigator as NavigatorWithUserAgentData).userAgentData?.platform ?? navigator.platform;
  return /mac|iphone|ipad|ipod/i.test(platform) ? 'Option' : 'Alt';
}

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
  )({ modifierKey: getModifierKey() });
}

/**
 * Returns whether `GridKeyboardReorderDescriptions` renders the description of the reorder keys.
 * The props are read during render, unlike selector arguments, which React 18 can leave stale.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {Pick<DataGridProProcessedProps, 'rowReordering' | 'disableColumnReorder'>} props The props that turn the features on.
 * @param {KeyboardReorderDescriptionKind} kind Whether the description is for rows or columns.
 * @returns {boolean} Whether the description is rendered.
 */
export function isKeyboardReorderDescriptionRendered(
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'rowReordering' | 'disableColumnReorder'>,
  kind: KeyboardReorderDescriptionKind,
): boolean {
  const isFeatureOn = kind === 'row' ? !!props.rowReordering : !props.disableColumnReorder;
  return isFeatureOn && getKeyboardReorderDescriptionText(apiRef, kind) !== '';
}

function getDescriptionId(
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'rowReordering' | 'disableColumnReorder'>,
  kind: KeyboardReorderDescriptionKind,
) {
  return isKeyboardReorderDescriptionRendered(apiRef, props, kind)
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
    steps.row ? getDescriptionId(apiRef, rootProps, 'row') : undefined,
    steps.column ? getDescriptionId(apiRef, rootProps, 'column') : undefined,
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
  return isDescribed ? getDescriptionId(apiRef, rootProps, 'column') : undefined;
};
