import type { RefObject } from '@mui/x-internals/types';
import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
import {
  GRID_CHECKBOX_SELECTION_FIELD,
  gridColumnLookupSelector,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowTreeSelector,
  gridRowsLookupSelector,
  gridSortModelSelector,
} from '@mui/x-data-grid';
import type {
  GridColDef,
  GridEditingState,
  GridRowId,
  GridRowModel,
  GridSortModel,
  GridTreeNode,
} from '@mui/x-data-grid';
import {
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GRID_TREE_DATA_GROUPING_FIELD,
  createSelector,
  gridEditRowsStateSelector,
  gridKeyboardUseActiveSelector,
  isGroupingColumn,
} from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import { GRID_REORDER_COL_DEF } from '../rowReorder/gridRowReorderColDef';
import { isRowReorderAllowed } from '../rowReorder/rowReorderDragUtils';

// The rules that decide whether a step can move a row or a column.
// The move and the marker both read them, so the marker only shows when a press would act.

/**
 * - `off`: the feature doesn't apply, and the keyboard navigation keeps the key.
 * - `sorted`, `invalid`, `disabled`: the step is refused and the reason is announced.
 * - `silent`: the step is refused without an announcement.
 * - `allowed`: the row or the column can move. Its neighbours decide how far.
 */
export type ReorderStepStatus = 'off' | 'sorted' | 'invalid' | 'disabled' | 'silent' | 'allowed';

export type RowReorderStepProps = Pick<
  DataGridProProcessedProps,
  'rowReordering' | 'isRowReorderable'
>;

export type ColumnReorderStepProps = Pick<DataGridProProcessedProps, 'disableColumnReorder'>;

function getRowStepStatus(
  params: RowReorderStepProps & {
    sortModel: GridSortModel;
    editRowsState: GridEditingState;
    maxTreeDepth: number;
    rowNode: GridTreeNode | undefined;
    row: GridRowModel | undefined;
  },
): ReorderStepStatus {
  const { rowReordering, isRowReorderable, sortModel, editRowsState, maxTreeDepth, rowNode, row } =
    params;
  // Only flat rows move with the keyboard for now
  if (!rowReordering || maxTreeDepth > 1 || !isObjectEmpty(editRowsState)) {
    return 'off';
  }
  if (
    rowNode?.type !== 'leaf' ||
    !row ||
    (isRowReorderable && !isRowReorderable({ row, rowNode }))
  ) {
    return 'invalid';
  }
  // Editing is checked above, so the sort model is the only reason left
  if (!isRowReorderAllowed({ rowReordering, sortModel, editRowsState })) {
    return 'sorted';
  }
  return 'allowed';
}

// The columns the grid adds itself. They all have `disableReorder`.
function isSpecialColumn(field: string) {
  return (
    field === GRID_CHECKBOX_SELECTION_FIELD ||
    field === GRID_REORDER_COL_DEF.field ||
    field === GRID_DETAIL_PANEL_TOGGLE_FIELD ||
    field === GRID_TREE_DATA_GROUPING_FIELD ||
    isGroupingColumn(field)
  );
}

function getColumnStepStatus(
  params: ColumnReorderStepProps & {
    editRowsState: GridEditingState;
    field: string;
    column: GridColDef | undefined;
  },
): ReorderStepStatus {
  const { disableColumnReorder, editRowsState, field, column } = params;
  if (disableColumnReorder || !isObjectEmpty(editRowsState)) {
    return 'off';
  }
  if (!column) {
    return 'silent';
  }
  if (column.disableReorder) {
    // "Column __check__ can't be reordered" means nothing to a user
    return isSpecialColumn(field) ? 'silent' : 'disabled';
  }
  return 'allowed';
}

/**
 * Returns whether a step can move the row, and why not.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {RowReorderStepProps} props The props that the rules depend on.
 * @param {GridRowId} rowId The row to move.
 * @returns {ReorderStepStatus} The status of the step.
 */
export function getRowReorderStepStatus(
  apiRef: RefObject<GridPrivateApiPro>,
  props: RowReorderStepProps,
  rowId: GridRowId,
): ReorderStepStatus {
  return getRowStepStatus({
    rowReordering: props.rowReordering,
    isRowReorderable: props.isRowReorderable,
    sortModel: gridSortModelSelector(apiRef),
    editRowsState: gridEditRowsStateSelector(apiRef),
    maxTreeDepth: gridRowMaximumTreeDepthSelector(apiRef),
    rowNode: gridRowTreeSelector(apiRef)[rowId],
    row: gridRowsLookupSelector(apiRef)[rowId],
  });
}

/**
 * Returns whether a step can move the column, and why not.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {ColumnReorderStepProps} props The props that the rules depend on.
 * @param {string} field The column to move.
 * @returns {ReorderStepStatus} The status of the step.
 */
export function getColumnReorderStepStatus(
  apiRef: RefObject<GridPrivateApiPro>,
  props: ColumnReorderStepProps,
  field: string,
): ReorderStepStatus {
  return getColumnStepStatus({
    disableColumnReorder: props.disableColumnReorder,
    editRowsState: gridEditRowsStateSelector(apiRef),
    field,
    column: gridColumnLookupSelector(apiRef)[field],
  });
}

/**
 * Whether the row is marked: the keyboard is in use, a cell of the row has the focus,
 * and a step could move the row.
 */
export const gridRowKeyboardReorderTargetSelector = createSelector(
  gridKeyboardUseActiveSelector,
  gridFocusCellSelector,
  gridSortModelSelector,
  gridEditRowsStateSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowTreeSelector,
  gridRowsLookupSelector,
  (
    isKeyboardInUse,
    focusedCell,
    sortModel,
    editRowsState,
    maxTreeDepth,
    tree,
    rowsLookup,
    { rowId, rowReordering, isRowReorderable }: RowReorderStepProps & { rowId: GridRowId },
  ) =>
    isKeyboardInUse &&
    focusedCell?.id === rowId &&
    getRowStepStatus({
      rowReordering,
      isRowReorderable,
      sortModel,
      editRowsState,
      maxTreeDepth,
      rowNode: tree[rowId],
      row: rowsLookup[rowId],
    }) === 'allowed',
);

/**
 * Whether the column header is marked: the keyboard is in use, a cell of the column or its header
 * has the focus, and a step could move the column.
 */
export const gridColumnKeyboardReorderTargetSelector = createSelector(
  gridKeyboardUseActiveSelector,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  gridEditRowsStateSelector,
  gridColumnLookupSelector,
  (
    isKeyboardInUse,
    focusedCell,
    focusedHeader,
    editRowsState,
    columnLookup,
    { field, disableColumnReorder }: ColumnReorderStepProps & { field: string },
  ) =>
    isKeyboardInUse &&
    (focusedCell?.field ?? focusedHeader?.field) === field &&
    getColumnStepStatus({
      disableColumnReorder,
      editRowsState,
      field,
      column: columnLookup[field],
    }) === 'allowed',
);
