'use client';
import * as React from 'react';
import type { MuiEvent, RefObject } from '@mui/x-internals/types';
import { useRtl } from '@mui/system/RtlProvider';
import {
  gridExpandedRowCountSelector,
  gridExpandedSortedRowIndexLookupSelector,
  gridPaginationSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiMethod,
  useGridEventPriority,
} from '@mui/x-data-grid';
import type { GridEventListener } from '@mui/x-data-grid';
import { getRowIndexRelativeToAllRows, isEventForCellContent } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import type { GridKeyboardReorderPrivateApi } from '../../../models/gridKeyboardReorderApi';
import {
  commitRowReorder,
  getRowMoveTarget,
  isReorderSessionActive,
} from '../rowReorder/rowReorderDragUtils';
import { getColumnMoveTarget, publishColumnOrderChange } from '../columnReorder/columnReorderUtils';
import type { ColumnReorderDirection } from '../columnReorder/columnReorderUtils';
import { getColumnReorderStepStatus, getRowReorderStepStatus } from './keyboardReorderUtils';

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

function markAsHandled(event: MuiEvent<React.KeyboardEvent>) {
  // On Windows and Linux, `Alt+Left/Right` navigates the browser history
  event.preventDefault();
  event.defaultMuiPrevented = true;
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
    if (status === 'invalid') {
      announce(apiRef.current.getLocaleText('rowReorderingAnnouncementInvalid')());
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

  // `Home` is the start of the row: the left side in LTR, and the right side in RTL
  const getColumnDirection = (key: ReorderKey): ColumnReorderDirection => {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      return key === 'ArrowLeft' ? 'left' : 'right';
    }
    return (key === 'Home') !== isRtl ? 'left' : 'right';
  };

  const handleCellKeyDown: GridEventListener<'cellKeyDown'> = (params, event) => {
    const key = getReorderKey(event);
    if (key === null || isEventForCellContent(event)) {
      return;
    }
    // When the feature doesn't apply, the keyboard navigation moves the focus
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      if (getColumnReorderStepStatus(apiRef, props, params.field) !== 'off') {
        markAsHandled(event);
        stepColumnReorder(params.field, getColumnDirection(key), { toEdge: false });
      }
      return;
    }
    if (getRowReorderStepStatus(apiRef, props, params.id) !== 'off') {
      markAsHandled(event);
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
    markAsHandled(event);
    stepColumnReorder(params.field, getColumnDirection(key), {
      toEdge: key === 'Home' || key === 'End',
    });
  };

  // Before the keyboard navigation, which moves the focus on `Alt+Arrow`.
  // Registered before `useGridEvents`, so the `onCellKeyDown` prop still runs first.
  useGridEventPriority(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridEventPriority(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
};
