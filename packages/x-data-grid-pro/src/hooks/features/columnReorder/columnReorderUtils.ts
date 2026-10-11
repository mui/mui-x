import type { RefObject } from '@mui/x-internals/types';
import type { CursorCoordinates, GridColumnOrderChangeParams } from '@mui/x-data-grid';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';

// Column reordering logic shared by the HTML drag and drop path (`useGridColumnReorder`)
// and the pointer events path.

const CURSOR_MOVE_DIRECTION_LEFT = 'left';
const CURSOR_MOVE_DIRECTION_RIGHT = 'right';

const getCursorMoveDirectionX = (
  currentCoordinates: CursorCoordinates,
  nextCoordinates: CursorCoordinates,
) => {
  return currentCoordinates.x <= nextCoordinates.x
    ? CURSOR_MOVE_DIRECTION_RIGHT
    : CURSOR_MOVE_DIRECTION_LEFT;
};

export const hasCursorPositionChanged = (
  currentCoordinates: CursorCoordinates,
  nextCoordinates: CursorCoordinates,
): boolean =>
  currentCoordinates.x !== nextCoordinates.x || currentCoordinates.y !== nextCoordinates.y;

/**
 * Indexes of all columns the dragged column can't move to.
 */
export type ColumnReorderForbiddenIndexes = { [key: number]: boolean };

/**
 * Returns the indexes the dragged column can't move to, so it doesn't leave its column group,
 * or split another one, unless the groups allow `freeReordering`.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {string} field The dragged column.
 * @returns {ColumnReorderForbiddenIndexes} The forbidden indexes, among all columns.
 */
export function getColumnReorderForbiddenIndexes(
  apiRef: RefObject<GridPrivateApiPro>,
  field: string,
): ColumnReorderForbiddenIndexes {
  const draggingColumnGroupPath = apiRef.current.getColumnGroupPath(field);

  const columnIndex = apiRef.current.getColumnIndex(field, false);
  const allColumns = apiRef.current.getAllColumns();
  const groupsLookup = apiRef.current.getAllGroupDetails();

  const getGroupPathFromColumnIndex = (colIndex: number) => {
    const colField = allColumns[colIndex].field;
    return apiRef.current.getColumnGroupPath(colField);
  };

  // The limitingGroupId is the id of the group from which the dragged column should not escape
  let limitingGroupId: string | null = null;

  draggingColumnGroupPath.forEach((groupId) => {
    if (!groupsLookup[groupId]?.freeReordering) {
      // Only consider group that are made of more than one column
      if (columnIndex > 0 && getGroupPathFromColumnIndex(columnIndex - 1).includes(groupId)) {
        limitingGroupId = groupId;
      } else if (
        columnIndex + 1 < allColumns.length &&
        getGroupPathFromColumnIndex(columnIndex + 1).includes(groupId)
      ) {
        limitingGroupId = groupId;
      }
    }
  });

  const forbiddenIndexes: ColumnReorderForbiddenIndexes = {};

  for (let indexToForbid = 0; indexToForbid < allColumns.length; indexToForbid += 1) {
    const leftIndex = indexToForbid <= columnIndex ? indexToForbid - 1 : indexToForbid;
    const rightIndex = indexToForbid < columnIndex ? indexToForbid : indexToForbid + 1;

    if (limitingGroupId !== null) {
      // verify this indexToForbid will be linked to the limiting group. Otherwise forbid it
      let allowIndex = false;
      if (leftIndex >= 0 && getGroupPathFromColumnIndex(leftIndex).includes(limitingGroupId)) {
        allowIndex = true;
      } else if (
        rightIndex < allColumns.length &&
        getGroupPathFromColumnIndex(rightIndex).includes(limitingGroupId)
      ) {
        allowIndex = true;
      }
      if (!allowIndex) {
        forbiddenIndexes[indexToForbid] = true;
      }
    }

    // Verify we are not splitting another group
    if (leftIndex >= 0 && rightIndex < allColumns.length) {
      getGroupPathFromColumnIndex(rightIndex).forEach((groupId) => {
        if (getGroupPathFromColumnIndex(leftIndex).includes(groupId)) {
          if (!draggingColumnGroupPath.includes(groupId)) {
            // moving here split the group groupId in two distincts chunks
            if (!groupsLookup[groupId]?.freeReordering) {
              forbiddenIndexes[indexToForbid] = true;
            }
          }
        }
      });
    }
  }

  return forbiddenIndexes;
}

/**
 * Returns the index the dragged column moves to when the pointer goes over another column.
 * The column only moves when the pointer moves toward the target column, so it doesn't bounce
 * back and forth when the columns swap under a still pointer.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {object} params The drag.
 * @param {string} params.dragField The dragged column.
 * @param {string} params.targetField The column under the pointer. It must exist and differ from `dragField`.
 * @param {CursorCoordinates} params.previousPosition The pointer position of the last evaluation.
 * @param {CursorCoordinates} params.position The pointer position.
 * @param {boolean} params.isRtl Whether the grid is right-to-left.
 * @param {ColumnReorderForbiddenIndexes} params.forbiddenIndexes From `getColumnReorderForbiddenIndexes`.
 * @returns {number | null} The new index among all columns, or `null` when the column doesn't move.
 */
export function getColumnReorderTargetIndex(
  apiRef: RefObject<GridPrivateApiPro>,
  params: {
    dragField: string;
    targetField: string;
    previousPosition: CursorCoordinates;
    position: CursorCoordinates;
    isRtl: boolean;
    forbiddenIndexes: ColumnReorderForbiddenIndexes;
  },
): number | null {
  const { dragField, targetField, previousPosition, position, isRtl, forbiddenIndexes } = params;
  const targetColIndex = apiRef.current.getColumnIndex(targetField, false);
  const targetColVisibleIndex = apiRef.current.getColumnIndex(targetField, true);
  const targetCol = apiRef.current.getColumn(targetField);
  const dragColIndex = apiRef.current.getColumnIndex(dragField, false);
  const visibleColumns = apiRef.current.getVisibleColumns();
  const allColumns = apiRef.current.getAllColumns();

  const cursorMoveDirectionX = getCursorMoveDirectionX(previousPosition, position);
  const hasMovedLeft =
    cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_LEFT &&
    (isRtl ? dragColIndex < targetColIndex : targetColIndex < dragColIndex);
  const hasMovedRight =
    cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_RIGHT &&
    (isRtl ? targetColIndex < dragColIndex : dragColIndex < targetColIndex);

  // Callers check that the target column exists before calling
  if (!targetCol || (!hasMovedLeft && !hasMovedRight)) {
    return null;
  }

  let canBeReordered: boolean;
  let indexOffsetInHiddenColumns = 0;
  if (!targetCol.disableReorder) {
    canBeReordered = true;
  } else if (hasMovedLeft) {
    canBeReordered =
      targetColVisibleIndex > 0 && !visibleColumns[targetColVisibleIndex - 1].disableReorder;
  } else {
    canBeReordered =
      targetColVisibleIndex < visibleColumns.length - 1 &&
      !visibleColumns[targetColVisibleIndex + 1].disableReorder;
  }

  if (forbiddenIndexes[targetColIndex]) {
    let nextVisibleColumnField: string | null;
    let indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
    if (hasMovedLeft) {
      nextVisibleColumnField =
        targetColVisibleIndex > 0 ? visibleColumns[targetColVisibleIndex - 1].field : null;
      while (
        indexWithOffset > 0 &&
        allColumns[indexWithOffset].field !== nextVisibleColumnField &&
        forbiddenIndexes[indexWithOffset]
      ) {
        indexOffsetInHiddenColumns -= 1;
        indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
      }
    } else {
      nextVisibleColumnField =
        targetColVisibleIndex + 1 < visibleColumns.length
          ? visibleColumns[targetColVisibleIndex + 1].field
          : null;
      while (
        indexWithOffset < allColumns.length - 1 &&
        allColumns[indexWithOffset].field !== nextVisibleColumnField &&
        forbiddenIndexes[indexWithOffset]
      ) {
        indexOffsetInHiddenColumns += 1;
        indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
      }
    }

    if (
      forbiddenIndexes[indexWithOffset] ||
      allColumns[indexWithOffset].field === nextVisibleColumnField
    ) {
      // If we ended up on a visible column, or a forbidden one, we cannot do the reorder
      canBeReordered = false;
    }
  }

  const canBeReorderedProcessed = apiRef.current.unstable_applyPipeProcessors(
    'canBeReordered',
    canBeReordered,
    { targetIndex: targetColVisibleIndex },
  );

  return canBeReorderedProcessed ? targetColIndex + indexOffsetInHiddenColumns : null;
}

/**
 * Stores the dragged column, that the headers and the scroll areas render from.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {string} dragCol The dragged column, or `''` when no column is dragged.
 */
export function setColumnReorderDragCol(apiRef: RefObject<GridPrivateApiPro>, dragCol: string) {
  apiRef.current.setState((state) => ({
    ...state,
    columnReorder: { ...state.columnReorder, dragCol },
  }));
}

/**
 * Starts a column drag: stores the dragged column, and returns what the drag needs to move it.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {string} field The dragged column.
 * @returns {object} The index of the column among all columns, and the indexes it can't move to.
 */
export function startColumnReorder(
  apiRef: RefObject<GridPrivateApiPro>,
  field: string,
): { originIndex: number; forbiddenIndexes: ColumnReorderForbiddenIndexes } {
  setColumnReorderDragCol(apiRef, field);
  return {
    originIndex: apiRef.current.getColumnIndex(field, false),
    forbiddenIndexes: getColumnReorderForbiddenIndexes(apiRef, field),
  };
}

/**
 * Ends a column drag: restores the column to its origin index when it was dropped outside the grid
 * and the position isn't kept, otherwise publishes `columnOrderChange`. Then clears the dragged column.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {object} params The drag.
 * @param {string} params.dragField The dragged column.
 * @param {number} params.originIndex The index of the column, among all columns, when the drag started.
 * @param {boolean} params.restoreOrigin Whether to move the column back to `originIndex`.
 */
export function finishColumnReorder(
  apiRef: RefObject<GridPrivateApiPro>,
  params: { dragField: string; originIndex: number; restoreOrigin: boolean },
) {
  const { dragField, originIndex, restoreOrigin } = params;
  if (restoreOrigin) {
    apiRef.current.setColumnIndex(dragField, originIndex);
  } else {
    const draggedColumn = apiRef.current.getColumn(dragField);
    if (draggedColumn) {
      // Emit the columnOrderChange event only once when the reordering stops.
      const columnOrderChangeParams: GridColumnOrderChangeParams = {
        column: draggedColumn,
        targetIndex: apiRef.current.getColumnIndexRelativeToVisibleColumns(dragField),
        oldIndex: originIndex,
      };

      apiRef.current.publishEvent('columnOrderChange', columnOrderChangeParams);
    }
  }

  setColumnReorderDragCol(apiRef, '');
}
