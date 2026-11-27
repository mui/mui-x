import type { RefObject } from '@mui/x-internals/types';
import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
import {
  GRID_CHECKBOX_SELECTION_FIELD,
  gridColumnLookupSelector,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowTreeSelector,
  gridRowsLoadingSelector,
  gridRowsLookupSelector,
  gridSortModelSelector,
  gridTabIndexCellSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
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
  createRootSelector,
  createSelector,
  gridEditRowsStateSelector,
  gridKeyboardUseActiveSelector,
  gridRowsStateSelector,
  isGroupingColumn,
} from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { GridStatePro } from '../../../models/gridStatePro';
import { GRID_REORDER_COL_DEF } from '../rowReorder/gridRowReorderColDef';
import { isRowReorderAllowed } from '../rowReorder/rowReorderDragUtils';

// The rules that decide whether a step can move a row or a column.
// The move and the marker both read them, so the marker only shows when a press would act.

/**
 * - `off`: the feature doesn't apply, and the keyboard navigation keeps the key.
 * - `sorted`, `disabled`: the step is refused and the reason is announced.
 * - `silent`: the step is refused without an announcement.
 * - `allowed`: the row or the column can move. Its neighbours decide how far.
 */
export type ReorderStepStatus = 'off' | 'sorted' | 'disabled' | 'silent' | 'allowed';

export type RowReorderStepProps = Pick<
  DataGridProProcessedProps,
  'rowReordering' | 'isRowReorderable'
>;

export type ColumnReorderStepProps = Pick<DataGridProProcessedProps, 'disableColumnReorder'>;

function getRowStepStatus(
  params: RowReorderStepProps & {
    sortModel: GridSortModel;
    editRowsState: GridEditingState;
    loading: boolean | undefined;
    maxTreeDepth: number;
    rowNode: GridTreeNode | undefined;
    row: GridRowModel | undefined;
  },
): ReorderStepStatus {
  const {
    rowReordering,
    isRowReorderable,
    sortModel,
    editRowsState,
    loading,
    maxTreeDepth,
    rowNode,
    row,
  } = params;
  // Only flat rows move with the keyboard for now
  if (!rowReordering || maxTreeDepth > 1 || !isObjectEmpty(editRowsState)) {
    return 'off';
  }
  // Like a drag, which the loading overlay blocks.
  // For example while `onRowOrderChange` saves the previous move.
  if (loading) {
    return 'silent';
  }
  if (
    rowNode?.type !== 'leaf' ||
    !row ||
    (isRowReorderable && !isRowReorderable({ row, rowNode }))
  ) {
    return 'disabled';
  }
  // Editing is checked above, so the sort model is the only reason left
  if (!isRowReorderAllowed({ rowReordering, sortModel, editRowsState })) {
    return 'sorted';
  }
  return 'allowed';
}

// `GRID_FORMULA_ROW_NUMBER_FIELD` of Premium, which Pro can't import
const FORMULA_ROW_NUMBER_FIELD = '__formula_row_number__';

// The columns the grid adds itself. They all have `disableReorder`.
function isSpecialColumn(field: string) {
  return (
    field === GRID_CHECKBOX_SELECTION_FIELD ||
    field === GRID_REORDER_COL_DEF.field ||
    field === GRID_DETAIL_PANEL_TOGGLE_FIELD ||
    field === GRID_TREE_DATA_GROUPING_FIELD ||
    field === FORMULA_ROW_NUMBER_FIELD ||
    isGroupingColumn(field)
  );
}

type VisiblePinnedColumns = ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>;

// The pinned columns as rendered, which `disableColumnPinning` and the list view turn off
function isColumnPinned(pinnedColumns: VisiblePinnedColumns, field: string) {
  return (
    pinnedColumns.left.some((column) => column.field === field) ||
    pinnedColumns.right.some((column) => column.field === field)
  );
}

function getColumnStepStatus(
  params: ColumnReorderStepProps & {
    editRowsState: GridEditingState;
    pinnedColumns: VisiblePinnedColumns;
    field: string;
    column: GridColDef | undefined;
  },
): ReorderStepStatus {
  const { disableColumnReorder, editRowsState, pinnedColumns, field, column } = params;
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
  // Like a drag, which can't start from a pinned header
  if (isColumnPinned(pinnedColumns, field)) {
    return 'disabled';
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
    loading: gridRowsLoadingSelector(apiRef),
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
    pinnedColumns: gridVisiblePinnedColumnDefinitionsSelector(apiRef),
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
  gridRowsStateSelector,
  (
    isKeyboardInUse,
    focusedCell,
    sortModel,
    editRowsState,
    maxTreeDepth,
    rowsState,
    { rowId, rowReordering, isRowReorderable }: RowReorderStepProps & { rowId: GridRowId },
  ) =>
    isKeyboardInUse &&
    focusedCell?.id === rowId &&
    getRowStepStatus({
      rowReordering,
      isRowReorderable,
      sortModel,
      editRowsState,
      loading: rowsState.loading,
      maxTreeDepth,
      rowNode: rowsState.tree[rowId],
      row: rowsState.dataRowIdToModelLookup[rowId],
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
  gridVisiblePinnedColumnDefinitionsSelector,
  gridColumnLookupSelector,
  (
    isKeyboardInUse,
    focusedCell,
    focusedHeader,
    editRowsState,
    pinnedColumns,
    columnLookup,
    { field, disableColumnReorder }: ColumnReorderStepProps & { field: string },
  ) =>
    isKeyboardInUse &&
    (focusedCell?.field ?? focusedHeader?.field) === field &&
    getColumnStepStatus({
      disableColumnReorder,
      editRowsState,
      pinnedColumns,
      field,
      column: columnLookup[field],
    }) === 'allowed',
);

export type KeyboardReorderDescriptionKind = 'row' | 'column';

/**
 * Returns the id of the node that describes the reorder keys of rows or columns.
 * It only depends on the grid instance, so the nodes and the elements they describe agree on it.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {KeyboardReorderDescriptionKind} kind Whether the node describes rows or columns.
 * @returns {string} The id of the node.
 */
export function getKeyboardReorderDescriptionId(
  apiRef: RefObject<GridPrivateApiPro>,
  kind: KeyboardReorderDescriptionKind,
): string {
  return `mui-data-grid-${apiRef.current.instanceId.id}-${kind}-reorder-description`;
}

export const gridKeyboardReorderDescribedCellSelector = createRootSelector(
  (state: GridStatePro) => state.keyboardReorder.describedCell,
);

export const gridKeyboardReorderUnreadDescriptionsSelector = createRootSelector(
  (state: GridStatePro) => state.keyboardReorder.unreadDescriptions,
);

/**
 * Whether the column header describes the reorder keys: a step could move the column.
 * Unlike the marker, it doesn't wait for a key press, so the description is there when the focus lands.
 */
export const gridColumnKeyboardReorderDescribedSelector = createSelector(
  gridEditRowsStateSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  gridColumnLookupSelector,
  (
    editRowsState,
    pinnedColumns,
    columnLookup,
    { field, disableColumnReorder }: ColumnReorderStepProps & { field: string },
  ) =>
    getColumnStepStatus({
      disableColumnReorder,
      editRowsState,
      pinnedColumns,
      field,
      column: columnLookup[field],
    }) === 'allowed',
);

export type KeyboardReorderCellDescriptionArgs = RowReorderStepProps &
  ColumnReorderStepProps & {
    rowId: GridRowId;
  };

/**
 * The cell of a row that describes the reorder keys, and the steps it describes.
 */
export interface KeyboardReorderCellDescribedSteps {
  /**
   * The field of the cell.
   */
  field: string;
  /**
   * Whether a step could move the row.
   */
  row: boolean;
  /**
   * Whether a step could move the column.
   */
  column: boolean;
}

/**
 * Returns the cell of the row that describes the reorder keys, and the unread steps it describes.
 * Until the focus lands on a cell, it's the cell with the tab stop,
 * so the description is there when the focus lands on it with the keyboard.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {KeyboardReorderCellDescriptionArgs} args The row and the props that the rules depend on.
 * @returns {KeyboardReorderCellDescribedSteps | null} The cell and its steps, or `null`.
 */
export function gridCellKeyboardReorderDescribedStepsSelector(
  apiRef: RefObject<GridPrivateApiPro>,
  args: KeyboardReorderCellDescriptionArgs,
): KeyboardReorderCellDescribedSteps | null {
  const { rowId } = args;
  const describedCell = gridKeyboardReorderDescribedCellSelector(apiRef);
  const cell = describedCell === 'tabStop' ? gridTabIndexCellSelector(apiRef) : describedCell;
  // Called for every rendered row, so leave early for the other rows
  if (cell?.id !== rowId) {
    return null;
  }

  const unread = gridKeyboardReorderUnreadDescriptionsSelector(apiRef);
  const row = unread.row && getRowReorderStepStatus(apiRef, args, rowId) === 'allowed';
  const column =
    unread.column && getColumnReorderStepStatus(apiRef, args, cell.field) === 'allowed';
  return row || column ? { field: cell.field, row, column } : null;
}
