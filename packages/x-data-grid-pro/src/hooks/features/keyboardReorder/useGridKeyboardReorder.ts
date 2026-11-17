'use client';
import * as React from 'react';
import type { MuiEvent, RefObject } from '@mui/x-internals/types';
import { useRtl } from '@mui/system/RtlProvider';
import {
  GRID_CHECKBOX_SELECTION_FIELD,
  gridExpandedRowCountSelector,
  gridExpandedSortedRowIndexLookupSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowNodeSelector,
  gridSortModelSelector,
  gridVisibleColumnFieldsSelector,
  useGridEventPriority,
} from '@mui/x-data-grid';
import type { GridEventListener, GridRowId } from '@mui/x-data-grid';
import {
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GRID_TREE_DATA_GROUPING_FIELD,
  getRowIndexRelativeToAllRows,
  gridEditRowsStateSelector,
  isGroupingColumn,
  useGridNativeEventListener,
} from '@mui/x-data-grid/internals';
import type { GridStateInitializer, RowReorderDragDirection } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from '../rowReorder/gridRowReorderColDef';
import {
  commitRowReorder,
  getKeyboardRowMoveTarget,
  isReorderSessionActive,
  isRowReorderAllowed,
} from '../rowReorder/rowReorderDragUtils';
import {
  getColumnReorderContext,
  getColumnReorderTargetIndex,
  publishColumnOrderChange,
} from '../columnReorder/columnReorderUtils';
import type { ColumnReorderDirection } from '../columnReorder/columnReorderUtils';

type ReorderKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';

const REORDER_KEYS = new Set<string>([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]);

const TEXT_ENTRY_SELECTOR =
  'input:not([type="checkbox"]), textarea, select, [contenteditable="true"]';

function getReorderKey(event: React.KeyboardEvent): ReorderKey | null {
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return null;
  }
  return REORDER_KEYS.has(event.key) ? (event.key as ReorderKey) : null;
}

function isTextEntryTarget(target: EventTarget) {
  return target instanceof Element && target.closest(TEXT_ENTRY_SELECTOR) !== null;
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

function markAsHandled(event: MuiEvent<React.KeyboardEvent>) {
  // On Windows and Linux, `Alt+Left/Right` navigates the browser history
  event.preventDefault();
  event.defaultMuiPrevented = true;
}

export const keyboardReorderStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  keyboardReorder: { showTarget: false },
});

/**
 * Moves the focused row with `Alt+ArrowUp/Down`, and the focused column with `Alt+ArrowLeft/Right`.
 * `Alt+Home/End` move the row from a cell, and the column from a header, as far as allowed.
 * @requires useGridRowReorder (pipe processor `isRowReorderValid`)
 * @requires useGridColumnReorder (state)
 */
export const useGridKeyboardReorder = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'rowReordering' | 'isRowReorderable' | 'isValidRowReorder' | 'disableColumnReorder'
  >,
): void => {
  const isRtl = useRtl();
  const isRowMovePendingRef = React.useRef(false);

  const announce = (message: string) => apiRef.current.announce(message);

  const setShowTarget = (showTarget: boolean) => {
    if (apiRef.current.state.keyboardReorder.showTarget === showTarget) {
      return;
    }
    apiRef.current.setState((state) => ({
      ...state,
      keyboardReorder: { ...state.keyboardReorder, showTarget },
    }));
  };

  const moveRow = async (
    rowId: GridRowId,
    direction: RowReorderDragDirection,
    toEdge: boolean,
    event: MuiEvent<React.KeyboardEvent>,
  ) => {
    // Only flat rows move with the keyboard for now
    if (!props.rowReordering || gridRowMaximumTreeDepthSelector(apiRef) > 1) {
      return;
    }
    markAsHandled(event);
    if (isRowMovePendingRef.current || isReorderSessionActive(apiRef)) {
      return;
    }

    const rowNode = gridRowNodeSelector(apiRef, rowId);
    const row = apiRef.current.getRow(rowId);
    if (
      rowNode?.type !== 'leaf' ||
      !row ||
      (props.isRowReorderable && !props.isRowReorderable({ row, rowNode }))
    ) {
      announce(apiRef.current.getLocaleText('rowReorderingAnnouncementInvalid')());
      return;
    }
    // Editing is checked by the caller, so the sort model is the only reason left
    const isAllowed = isRowReorderAllowed({
      rowReordering: props.rowReordering,
      sortModel: gridSortModelSelector(apiRef),
      editRowsState: gridEditRowsStateSelector(apiRef),
    });
    if (!isAllowed) {
      announce(apiRef.current.getLocaleText('rowReorderingAnnouncementSorted')());
      return;
    }

    const result = getKeyboardRowMoveTarget(apiRef, {
      rowId,
      direction,
      toEdge,
      hasCustomValidation: !!props.isValidRowReorder,
    });
    if ('refusal' in result) {
      announce(
        result.refusal === 'edge'
          ? apiRef.current.getLocaleText('rowReorderingAnnouncementEdge')({ direction })
          : apiRef.current.getLocaleText('rowReorderingAnnouncementInvalid')(),
      );
      return;
    }

    const oldIndex = gridExpandedSortedRowIndexLookupSelector(apiRef)[rowId];
    isRowMovePendingRef.current = true;
    try {
      await commitRowReorder(
        apiRef,
        rowId,
        result.target,
        (move) => move(),
        () => {},
      );
    } finally {
      isRowMovePendingRef.current = false;
    }

    const newIndex = gridExpandedSortedRowIndexLookupSelector(apiRef)[rowId];
    // For example a `setRowPosition` that a data source rejected
    if (newIndex === undefined || newIndex === oldIndex) {
      announce(apiRef.current.getLocaleText('rowReorderingAnnouncementInvalid')());
      return;
    }
    apiRef.current.scrollToIndexes({ rowIndex: getRowIndexRelativeToAllRows(apiRef, rowId) });
    announce(
      apiRef.current.getLocaleText('rowReorderingAnnouncementMoved')({
        position: newIndex + 1,
        total: gridExpandedRowCountSelector(apiRef),
        rowId,
      }),
    );
  };

  const moveColumn = (
    field: string,
    direction: ColumnReorderDirection,
    toEdge: boolean,
    event: MuiEvent<React.KeyboardEvent>,
  ) => {
    if (props.disableColumnReorder) {
      return;
    }
    markAsHandled(event);
    const column = apiRef.current.getColumn(field);
    if (!column || isReorderSessionActive(apiRef)) {
      return;
    }
    const columnName = column.headerName ?? field;
    if (column.disableReorder) {
      if (!isSpecialColumn(field)) {
        announce(
          apiRef.current.getLocaleText('columnReorderingAnnouncementDisabled')({ columnName }),
        );
      }
      return;
    }

    const visibleFields = gridVisibleColumnFieldsSelector(apiRef);
    const step = (direction === 'left') !== isRtl ? -1 : 1;
    const { originIndex, forbiddenIndexes } = getColumnReorderContext(apiRef, field);
    const getTargetIndex = (targetField: string | undefined) =>
      targetField === undefined
        ? null
        : getColumnReorderTargetIndex(apiRef, {
            dragField: field,
            targetField,
            direction,
            isRtl,
            forbiddenIndexes,
          });

    let neighbourIndex = apiRef.current.getColumnIndex(field, true) + step;
    let targetIndex = getTargetIndex(visibleFields[neighbourIndex]);
    if (targetIndex === null) {
      announce(
        apiRef.current.getLocaleText('columnReorderingAnnouncementEdge')({ columnName, direction }),
      );
      return;
    }
    // Validates each column on the way, and moves the column once
    while (toEdge) {
      const nextTargetIndex = getTargetIndex(visibleFields[neighbourIndex + step]);
      if (nextTargetIndex === null) {
        break;
      }
      targetIndex = nextTargetIndex;
      neighbourIndex += step;
    }

    apiRef.current.setColumnIndex(field, targetIndex, false);
    publishColumnOrderChange(apiRef, field, originIndex);
    const visibleIndex = apiRef.current.getColumnIndex(field, true);
    apiRef.current.scrollToIndexes({ colIndex: visibleIndex });
    announce(
      apiRef.current.getLocaleText('columnReorderingAnnouncementMoved')({
        columnName,
        position: visibleIndex + 1,
        total: visibleFields.length,
      }),
    );
  };

  // `Home` is the start of the row: the left side in LTR, and the right side in RTL
  const getColumnDirection = (key: ReorderKey): ColumnReorderDirection => {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      return key === 'ArrowLeft' ? 'left' : 'right';
    }
    return (key === 'Home') !== isRtl ? 'left' : 'right';
  };

  const handleCellKeyDown: GridEventListener<'cellKeyDown'> = (params, event) => {
    setShowTarget(true);
    const key = getReorderKey(event);
    if (
      key === null ||
      isTextEntryTarget(event.target) ||
      Object.keys(gridEditRowsStateSelector(apiRef)).length > 0
    ) {
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      moveColumn(params.field, getColumnDirection(key), false, event);
      return;
    }
    const direction = key === 'ArrowUp' || key === 'Home' ? 'up' : 'down';
    moveRow(params.id, direction, key === 'Home' || key === 'End', event);
  };

  const handleColumnHeaderKeyDown: GridEventListener<'columnHeaderKeyDown'> = (params, event) => {
    setShowTarget(true);
    const key = getReorderKey(event);
    if (
      key === null ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      isTextEntryTarget(event.target) ||
      Object.keys(gridEditRowsStateSelector(apiRef)).length > 0
    ) {
      return;
    }
    moveColumn(params.field, getColumnDirection(key), key === 'Home' || key === 'End', event);
  };

  // Before the keyboard navigation, which moves the focus on `Alt+Arrow`.
  // Registered before `useGridEvents`, so the `onCellKeyDown` prop still runs first.
  useGridEventPriority(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridEventPriority(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
  // Mouse and touch users never see the marker
  useGridNativeEventListener(
    apiRef,
    () => apiRef.current.rootElementRef.current,
    'pointerdown',
    () => setShowTarget(false),
  );
};
