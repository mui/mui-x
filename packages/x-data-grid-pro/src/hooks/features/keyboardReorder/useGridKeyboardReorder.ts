'use client';
import * as React from 'react';
import type { MuiEvent, RefObject } from '@mui/x-internals/types';
import { useRtl } from '@mui/system/RtlProvider';
import {
  gridClasses,
  gridExpandedRowCountSelector,
  gridExpandedSortedRowIndexLookupSelector,
  gridPaginationSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiMethod,
  useGridEventPriority,
  useGridNativeEventListener,
} from '@mui/x-data-grid';
import type { GridCellCoordinates, GridEventListener } from '@mui/x-data-grid';
import {
  getActiveElement,
  getRowIndexRelativeToAllRows,
  isEventForCellContent,
  onFocusLeave,
} from '@mui/x-data-grid/internals';
import type { GridStateInitializer } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import type { GridKeyboardReorderPrivateApi } from '../../../models/gridKeyboardReorderApi';
import {
  commitRowReorder,
  getRowIdFromElement,
  getRowMoveTarget,
  isReorderSessionActive,
} from '../rowReorder/rowReorderDragUtils';
import { getColumnMoveTarget, publishColumnOrderChange } from '../columnReorder/columnReorderUtils';
import type { ColumnReorderDirection } from '../columnReorder/columnReorderUtils';
import {
  getColumnReorderStepStatus,
  getRowReorderStepStatus,
  gridKeyboardReorderDescribedCellSelector,
  gridKeyboardReorderUnreadDescriptionsSelector,
} from './keyboardReorderUtils';
import type { KeyboardReorderDescriptionKind } from './keyboardReorderUtils';
import { isKeyboardReorderDescriptionRendered } from './useGridKeyboardReorderDescription';
import type { GridKeyboardReorderState } from './keyboardReorderInterfaces';

const INITIAL_STATE: GridKeyboardReorderState = {
  describedCell: 'tabStop',
  unreadDescriptions: { row: true, column: true },
};

export const keyboardReorderStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  keyboardReorder: INITIAL_STATE,
});

// The popups of the grid render in a portal, so the focus leaves the root while they're open.
// For example the column menu, a panel, or the options of a `singleSelect` editor.
const POPUP_SELECTOR = [
  `.${gridClasses.menu}`,
  `.${gridClasses.panel}`,
  '[role="dialog"]',
  '[role="menu"]',
  '[role="listbox"]',
].join(', ');

function isInPopup(root: Element, element: Element | null) {
  const popup = element?.closest(POPUP_SELECTOR);
  // Not a dialog that the grid is in
  return !!popup && !popup.contains(root);
}

type ReorderKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';

const REORDER_KEYS = new Set<string>([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]);

function getReorderKey(event: React.KeyboardEvent): ReorderKey | null {
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return null;
  }
  return REORDER_KEYS.has(event.key) ? (event.key as ReorderKey) : null;
}

/**
 * Moves the focused row with `Alt+ArrowUp/Down`, and the focused column with `Alt+ArrowLeft/Right`.
 * `Alt+Home/End` move the row from a cell, and the column from a header, as far as allowed.
 * The moves are private API methods, so inputs other than the keyboard can call them.
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

  const stepRowReorder: GridKeyboardReorderPrivateApi['stepRowReorder'] = async (
    rowId,
    direction,
    { toEdge },
  ) => {
    const status = getRowReorderStepStatus(apiRef, props, rowId);
    if (
      status === 'off' ||
      status === 'silent' ||
      isRowMovePendingRef.current ||
      isReorderSessionActive(apiRef)
    ) {
      return;
    }
    if (status === 'disabled') {
      announce(apiRef.current.getLocaleText('rowReorderingAnnouncementDisabled')());
      return;
    }
    if (status === 'sorted') {
      announce(apiRef.current.getLocaleText('rowReorderingAnnouncementSorted')());
      return;
    }

    const result = getRowMoveTarget(apiRef, {
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
    const rowIndex = getRowIndexRelativeToAllRows(apiRef, rowId)!;
    apiRef.current.scrollToIndexes({ rowIndex });
    // With server-side pagination, only the rows of the page are loaded.
    // The position is among all rows when their count is known, and in the page otherwise.
    const pagination = gridPaginationSelector(apiRef);
    const hasKnownServerRowCount =
      pagination.enabled && pagination.paginationMode === 'server' && pagination.rowCount >= 0;
    announce(
      apiRef.current.getLocaleText('rowReorderingAnnouncementMoved')({
        position: (hasKnownServerRowCount ? rowIndex : newIndex) + 1,
        total: hasKnownServerRowCount ? pagination.rowCount : gridExpandedRowCountSelector(apiRef),
        rowId,
      }),
    );
  };

  const stepColumnReorder: GridKeyboardReorderPrivateApi['stepColumnReorder'] = (
    field,
    direction,
    { toEdge },
  ) => {
    const status = getColumnReorderStepStatus(apiRef, props, field);
    if (status === 'off' || status === 'silent' || isReorderSessionActive(apiRef)) {
      return;
    }
    // The status is only `disabled` or `allowed` for a column that exists
    const columnName = apiRef.current.getColumn(field)!.headerName || field;
    if (status === 'disabled') {
      announce(
        apiRef.current.getLocaleText('columnReorderingAnnouncementDisabled')({ columnName }),
      );
      return;
    }

    const targetIndex = getColumnMoveTarget(apiRef, { field, direction, toEdge, isRtl });
    if (targetIndex === null) {
      announce(
        apiRef.current.getLocaleText('columnReorderingAnnouncementEdge')({ columnName, direction }),
      );
      return;
    }

    const originIndex = apiRef.current.getColumnIndex(field, false);
    apiRef.current.setColumnIndex(field, targetIndex, false);
    publishColumnOrderChange(apiRef, field, originIndex);
    const visibleIndex = apiRef.current.getColumnIndex(field, true);
    apiRef.current.scrollToIndexes({ colIndex: visibleIndex });
    announce(
      apiRef.current.getLocaleText('columnReorderingAnnouncementMoved')({
        columnName,
        position: visibleIndex + 1,
        total: gridVisibleColumnFieldsSelector(apiRef).length,
      }),
    );
  };

  useGridApiMethod(apiRef, { stepRowReorder, stepColumnReorder }, 'private');

  // Screen readers read the description of the keys on every column header, and on the focused cells
  // until each description was read once. Reading it on every cell would repeat it on each arrow press.
  const setKeyboardReorderState = (
    describedCell: GridKeyboardReorderState['describedCell'],
    unreadDescriptions: GridKeyboardReorderState['unreadDescriptions'],
  ) => {
    const hasUnread = (['row', 'column'] as const).some(
      (kind) =>
        unreadDescriptions[kind] && isKeyboardReorderDescriptionRendered(apiRef, props, kind),
    );
    const keyboardReorder: GridKeyboardReorderState = hasUnread
      ? { describedCell, unreadDescriptions }
      : { describedCell: null, unreadDescriptions: { row: false, column: false } };
    const current = apiRef.current.state.keyboardReorder;
    if (
      current.describedCell === keyboardReorder.describedCell &&
      current.unreadDescriptions.row === keyboardReorder.unreadDescriptions.row &&
      current.unreadDescriptions.column === keyboardReorder.unreadDescriptions.column
    ) {
      return;
    }
    apiRef.current.setState((state) => ({ ...state, keyboardReorder }));
  };

  const markAsRead = (
    describedCell: GridKeyboardReorderState['describedCell'],
    read: Partial<GridKeyboardReorderState['unreadDescriptions']>,
  ) => {
    const unread = gridKeyboardReorderUnreadDescriptionsSelector(apiRef);
    setKeyboardReorderState(describedCell, {
      row: unread.row && !read.row,
      column: unread.column && !read.column,
    });
  };

  // The descriptions that a cell has, which are read once it gets a key press or loses the focus
  const getCellDescriptions = (cell: GridCellCoordinates) => ({
    row: getRowReorderStepStatus(apiRef, props, cell.id) === 'allowed',
    column: getColumnReorderStepStatus(apiRef, props, cell.field) === 'allowed',
  });

  const isDescribedCell = (cell: GridCellCoordinates | null) => {
    const describedCell = gridKeyboardReorderDescribedCellSelector(apiRef);
    return (
      describedCell !== null &&
      describedCell !== 'tabStop' &&
      cell?.id === describedCell.id &&
      cell.field === describedCell.field
    );
  };

  const getRootElement = () => apiRef.current.rootElementRef.current;

  const getCellFromElement = (element: Element): GridCellCoordinates | null => {
    const cellElement = element.closest(`.${gridClasses.cell}`);
    const rowElement = cellElement?.closest(`.${gridClasses.row}`);
    const field = cellElement?.getAttribute('data-field');
    if (!rowElement || !field) {
      return null;
    }
    const id = getRowIdFromElement(apiRef, rowElement);
    // Not a cell of a nested grid, for example in a detail panel
    return id !== null && apiRef.current.getCellElement(id, field) === cellElement
      ? { id, field }
      : null;
  };

  // The focused cell keeps its descriptions while it has the focus, so they can be read again.
  // It may not have the tab stop: VoiceOver moves the focus to the cell under its cursor.
  // A cell that can't describe a step, for example in a pinned row, leaves the description to the next one.
  const handleFocusIn = (event: FocusEvent) => {
    const describedCell = gridKeyboardReorderDescribedCellSelector(apiRef);
    if (describedCell === null) {
      return;
    }
    const cell = getCellFromElement(event.target as Element);
    if (describedCell === 'tabStop') {
      // For example a column header, before the focus reaches a cell
      if (cell) {
        markAsRead(cell, {});
      }
    } else if (!isDescribedCell(cell)) {
      markAsRead(cell ?? 'tabStop', getCellDescriptions(describedCell));
    }
  };

  const handleFocusOut = (event: FocusEvent) => {
    const root = getRootElement();
    if (root) {
      onFocusLeave(root, event, () => {
        // The visit goes on while a popup of the grid has the focus
        if (!isInPopup(root, getActiveElement(root.ownerDocument))) {
          setKeyboardReorderState(INITIAL_STATE.describedCell, INITIAL_STATE.unreadDescriptions);
        }
      });
    }
  };

  useGridNativeEventListener(apiRef, getRootElement, 'focusin', handleFocusIn);
  useGridNativeEventListener(apiRef, getRootElement, 'focusout', handleFocusOut);

  // `Home` is the start of the row: the left side in LTR, and the right side in RTL
  const getColumnDirection = (key: ReorderKey): ColumnReorderDirection => {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      return key === 'ArrowLeft' ? 'left' : 'right';
    }
    return (key === 'Home') !== isRtl ? 'left' : 'right';
  };

  // The user knows the keys of a move after its first press,
  // and the pressed cell read its descriptions
  const markAsHandled = (
    event: MuiEvent<React.KeyboardEvent>,
    kind: KeyboardReorderDescriptionKind,
    cell: GridCellCoordinates | null,
  ) => {
    // On Windows and Linux, `Alt+Left/Right` navigates the browser history
    event.preventDefault();
    event.defaultMuiPrevented = true;
    const describedCell = gridKeyboardReorderDescribedCellSelector(apiRef);
    markAsRead(describedCell, {
      ...(cell && isDescribedCell(cell) ? getCellDescriptions(cell) : {}),
      [kind]: true,
    });
  };

  const handleCellKeyDown: GridEventListener<'cellKeyDown'> = (params, event) => {
    const key = getReorderKey(event);
    if (key === null || isEventForCellContent(event)) {
      return;
    }
    // When the feature doesn't apply, the keyboard navigation moves the focus
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      if (getColumnReorderStepStatus(apiRef, props, params.field) !== 'off') {
        markAsHandled(event, 'column', params);
        stepColumnReorder(params.field, getColumnDirection(key), { toEdge: false });
      }
      return;
    }
    if (getRowReorderStepStatus(apiRef, props, params.id) !== 'off') {
      markAsHandled(event, 'row', params);
      stepRowReorder(params.id, key === 'ArrowUp' || key === 'Home' ? 'up' : 'down', {
        toEdge: key === 'Home' || key === 'End',
      });
    }
  };

  const handleColumnHeaderKeyDown: GridEventListener<'columnHeaderKeyDown'> = (params, event) => {
    const key = getReorderKey(event);
    if (
      key === null ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      isEventForCellContent(event) ||
      getColumnReorderStepStatus(apiRef, props, params.field) === 'off'
    ) {
      return;
    }
    markAsHandled(event, 'column', null);
    stepColumnReorder(params.field, getColumnDirection(key), {
      toEdge: key === 'Home' || key === 'End',
    });
  };

  // Before the keyboard navigation, which moves the focus on `Alt+Arrow`.
  // Registered before `useGridEvents`, so the `onCellKeyDown` prop still runs first.
  useGridEventPriority(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridEventPriority(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
};
