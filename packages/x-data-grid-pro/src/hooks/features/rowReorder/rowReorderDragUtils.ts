import type { RefObject } from '@mui/x-internals/types';
import {
  gridExpandedSortedRowIndexLookupSelector,
  gridRowNodeSelector,
  gridRowTreeSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid';
import type {
  GridEditingState,
  GridGroupNode,
  GridRowId,
  GridSortModel,
  GridTreeNode,
} from '@mui/x-data-grid';
import type { RowReorderDragDirection, RowReorderDropPosition } from '@mui/x-data-grid/internals';
import type { GridRowOrderChangeParams } from '../../../models/gridRowOrderChangeParams';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';

// Row reordering logic shared by the HTML drag and drop path (`useGridRowReorder`)
// and the pointer events path (`useGridRowReorderPointer`).

/**
 * Time in ms a dragged row must hover a collapsed group before the group expands.
 */
export const EXPAND_DELAY = 500;
/**
 * Distance in px the pointer can move over a group without canceling its pending expansion.
 */
export const EXPAND_CANCEL_BUFFER_PX = 5;

export interface RowReorderDropTarget {
  rowId: GridRowId;
  position: RowReorderDropPosition;
}

/**
 * Adds classes from `composeClasses`, which can hold the default class and custom ones separated by spaces.
 * `classList.add` throws on a token with a space.
 * @param {Element | null | undefined} element The element to update.
 * @param {string} className Space-separated classes.
 */
export function addClasses(element: Element | null | undefined, className: string) {
  element?.classList.add(...className.split(' ').filter(Boolean));
}

/**
 * Removes classes added with `addClasses`.
 * @param {Element | null | undefined} element The element to update.
 * @param {string} className Space-separated classes.
 */
export function removeClasses(element: Element | null | undefined, className: string) {
  element?.classList.remove(...className.split(' ').filter(Boolean));
}

/**
 * Returns whether rows can be reordered in the current grid state.
 * @param {object} params The values the decision depends on.
 * @param {boolean | undefined} params.rowReordering The `rowReordering` prop.
 * @param {GridSortModel} params.sortModel The sort model.
 * @param {GridEditingState} params.editRowsState The rows being edited.
 * @returns {boolean} `true` when rows can be reordered.
 */
export function isRowReorderAllowed(params: {
  rowReordering: boolean | undefined;
  sortModel: GridSortModel;
  editRowsState: GridEditingState;
}): boolean {
  // TODO: remove the sort model check once row reorder is compatible with sorting
  return (
    !!params.rowReordering &&
    params.sortModel.length === 0 &&
    Object.keys(params.editRowsState).length === 0
  );
}

/**
 * Returns the id of a row element.
 * `data-id` is always a string, while row ids can also be numbers.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {Element} rowElement The row element.
 * @returns {GridRowId | null} The row id, or `null` when the element isn't a row of the grid.
 */
export function getRowIdFromElement(
  apiRef: RefObject<GridPrivateApiPro>,
  rowElement: Element,
): GridRowId | null {
  const dataId = rowElement.getAttribute('data-id');
  if (dataId === null) {
    return null;
  }
  // The row tree is keyed by `String(id)`, so the string finds the node of a numeric id too.
  // The node has the id with its original type.
  return gridRowNodeSelector(apiRef, dataId)?.id ?? null;
}

/**
 * Returns where a dragged row would be dropped relative to the element under the pointer.
 * @param {Element} targetElement The element to measure: the cell for tree data, otherwise the row or the drag target.
 * @param {number} clientY The vertical pointer position.
 * @param {boolean} isTreeData Whether the grid uses tree data.
 * @returns {RowReorderDropPosition} The drop position.
 */
export function getRowDropPosition(
  targetElement: Element,
  clientY: number,
  isTreeData: boolean,
): RowReorderDropPosition {
  const targetRect = targetElement.getBoundingClientRect();
  const relativeY = Math.floor(clientY - targetRect.top);

  if (isTreeData) {
    // For tree data: top 20% = above, middle 60% = inside, bottom 20% = below
    if (relativeY < targetRect.height * 0.2) {
      return 'above';
    }
    if (relativeY > targetRect.height * 0.8) {
      return 'below';
    }
    return 'inside';
  }
  // For flat data and row grouping: split at the midpoint
  return relativeY < targetRect.height / 2 ? 'above' : 'below';
}

/**
 * Returns whether hovering `targetNode` with `sourceNode` should expand it after `EXPAND_DELAY`.
 * @param {GridTreeNode} sourceNode The dragged row.
 * @param {GridTreeNode} targetNode The row under the pointer.
 * @param {RowReorderDropPosition} dropPosition The drop position on `targetNode`.
 * @returns {boolean} `true` when the target is a collapsed group to expand.
 */
export function shouldExpandGroupOnHover(
  sourceNode: GridTreeNode,
  targetNode: GridTreeNode,
  dropPosition: RowReorderDropPosition,
): boolean {
  return (
    targetNode.type === 'group' &&
    !targetNode.childrenExpanded &&
    targetNode.id !== sourceNode.id &&
    (dropPosition === 'inside' || targetNode.depth < sourceNode.depth)
  );
}

/**
 * Returns whether the pointer left the group whose expansion is pending, or moved too much over it.
 * Passing over a group must not expand it.
 * @param {object} pending The pending expansion.
 * @param {GridRowId | null} pending.rowId The group waiting to expand, `null` when none is.
 * @param {number} pending.clientX The horizontal pointer position when the expansion was scheduled.
 * @param {number} pending.clientY The vertical pointer position when the expansion was scheduled.
 * @param {GridRowId} rowId The row under the pointer.
 * @param {number} clientX The horizontal pointer position.
 * @param {number} clientY The vertical pointer position.
 * @returns {boolean} `true` when the pending expansion must be canceled.
 */
export function hasLeftPendingExpansion(
  pending: { rowId: GridRowId | null; clientX?: number; clientY?: number },
  rowId: GridRowId,
  clientX: number,
  clientY: number,
): boolean {
  return (
    pending.rowId !== rowId ||
    clientY > pending.clientY! + EXPAND_CANCEL_BUFFER_PX ||
    clientY < pending.clientY! - EXPAND_CANCEL_BUFFER_PX ||
    clientX > pending.clientX! + EXPAND_CANCEL_BUFFER_PX ||
    clientX < pending.clientX! - EXPAND_CANCEL_BUFFER_PX
  );
}

/**
 * Toggles the expansion of the group a dragged row hovered.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {GridRowId} rowId The group id.
 */
export function toggleHoveredGroupExpansion(
  apiRef: RefObject<GridPrivateApiPro>,
  rowId: GridRowId,
) {
  const rowNode = gridRowNodeSelector(apiRef, rowId) as GridGroupNode;
  // TODO: Handle `dataSource` case with https://github.com/mui/mui-x/issues/18947
  apiRef.current.setRowChildrenExpansion(rowId, !rowNode.childrenExpanded);
}

/**
 * Runs the `isRowReorderValid` pipe processors.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {object} params The reorder to validate.
 * @param {GridRowId} params.sourceRowId The dragged row.
 * @param {GridRowId} params.targetRowId The row to drop on.
 * @param {RowReorderDropPosition} params.dropPosition The drop position on the target row.
 * @param {RowReorderDragDirection} params.dragDirection The drag direction.
 * @returns {boolean} `true` when the reorder is valid.
 */
export function checkRowReorderValid(
  apiRef: RefObject<GridPrivateApiPro>,
  params: {
    sourceRowId: GridRowId;
    targetRowId: GridRowId;
    dropPosition: RowReorderDropPosition;
    dragDirection: RowReorderDragDirection;
  },
): boolean {
  return apiRef.current.unstable_applyPipeProcessors('isRowReorderValid', false, params);
}

/**
 * Evaluates a new drop target while a row is dragged.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {GridRowId} sourceRowId The dragged row.
 * @param {GridRowId} targetRowId The row under the pointer.
 * @param {RowReorderDropPosition} dropPosition The drop position on the target row.
 * @returns {object} The drag direction, the index of the target row,
 * and whether the drop indicator shows: for valid drops, adjacent positions and the dragged row itself.
 */
export function evaluateRowDropTarget(
  apiRef: RefObject<GridPrivateApiPro>,
  sourceRowId: GridRowId,
  targetRowId: GridRowId,
  dropPosition: RowReorderDropPosition,
): { dragDirection: RowReorderDragDirection; targetRowIndex: number; showIndicator: boolean } {
  const sortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
  const targetRowIndex = sortedRowIndexLookup[targetRowId];
  const sourceRowIndex = sortedRowIndexLookup[sourceRowId];
  const dragDirection: RowReorderDragDirection = targetRowIndex < sourceRowIndex ? 'up' : 'down';

  const isSameNode = targetRowIndex === sourceRowIndex;
  const isAdjacentPosition =
    (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
    (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1);
  const isValid = checkRowReorderValid(apiRef, {
    sourceRowId,
    targetRowId,
    dropPosition,
    dragDirection,
  });

  return {
    dragDirection,
    targetRowIndex,
    showIndicator: isValid || isAdjacentPosition || isSameNode,
  };
}

/**
 * Stores the drop target that the drop indicator renders from.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {RowReorderDropTarget | undefined} dropTarget The drop target, or `undefined` to hide the indicator.
 */
export function setRowReorderDropTarget(
  apiRef: RefObject<GridPrivateApiPro>,
  dropTarget: RowReorderDropTarget | undefined,
) {
  apiRef.current.setState((state) => ({
    ...state,
    rowReorder: {
      ...state.rowReorder,
      dropTarget,
    },
  }));
}

/**
 * Moves the dragged row to the drop target and publishes `rowOrderChange`.
 * When the move fails, for example because the row disappeared from the tree, the event isn't published.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {GridRowId} rowId The dragged row.
 * @param {RowReorderDropTarget} dropTarget Where to drop the row.
 * @param {(move: () => Promise<void>) => Promise<void>} animate Runs `move`, and can animate the rows around it.
 * @param {() => void} onBeforePublish Called after the move, before `rowOrderChange`. The reorder state must be clear when the event runs.
 * @returns {Promise<void>} Resolves once the row moved and the event was published, or once the move failed.
 * Rejects only with an error thrown by a `rowOrderChange` listener, such as `onRowOrderChange`.
 */
export async function commitRowReorder(
  apiRef: RefObject<GridPrivateApiPro>,
  rowId: GridRowId,
  dropTarget: RowReorderDropTarget,
  animate: (move: () => Promise<void>) => Promise<void>,
  onBeforePublish: () => void,
): Promise<void> {
  // The error of a listener is kept apart from the failures of the move, which are expected and swallowed
  const listener = { failed: false, error: undefined as unknown };

  try {
    const sourceNode = gridRowNodeSelector(apiRef, rowId);
    if (!sourceNode) {
      return;
    }

    const oldParent = sourceNode.parent!;
    const oldParentNode = gridRowTreeSelector(apiRef)[oldParent] as GridGroupNode;
    const oldIndex = oldParentNode.children.indexOf(rowId);

    await animate(async () => {
      await apiRef.current.setRowPosition(rowId, dropTarget.rowId, dropTarget.position);

      const updatedTree = gridRowTreeSelector(apiRef);
      const updatedNode = updatedTree[rowId];
      if (!updatedNode) {
        return;
      }

      const newParent = updatedNode.parent!;
      const newParentNode = updatedTree[newParent] as GridGroupNode;

      const rowOrderChangeParams: GridRowOrderChangeParams = {
        row: apiRef.current.getRow(rowId)!,
        oldIndex,
        targetIndex: newParentNode.children.indexOf(rowId),
        oldParent: oldParent === GRID_ROOT_GROUP_ID ? null : oldParent,
        newParent: newParent === GRID_ROOT_GROUP_ID ? null : newParent,
      };

      onBeforePublish();
      try {
        apiRef.current.publishEvent('rowOrderChange', rowOrderChangeParams);
      } catch (error) {
        listener.failed = true;
        listener.error = error;
      }
    });
  } catch {
    // The move failed, for example a rejected `setRowPosition`: `rowOrderChange` isn't published.
    return;
  }

  if (listener.failed) {
    throw listener.error;
  }
}

/**
 * Animates the rendered rows from their position before `callback` to their position after it.
 * @param {HTMLElement} rootElement The grid root element.
 * @param {() => void | Promise<void>} callback Moves the rows.
 * @returns {Promise<void>} Resolves once `callback` resolved.
 */
export async function animateRowMove(
  rootElement: HTMLElement,
  callback: () => void | Promise<void>,
): Promise<void> {
  const initialPositions = new Map<string, DOMRect>();
  rootElement.querySelectorAll<HTMLElement>('[data-id]').forEach((row) => {
    const rowId = row.getAttribute('data-id');
    if (rowId) {
      initialPositions.set(rowId, row.getBoundingClientRect());
    }
  });

  await callback();

  // Wait for the DOM to update
  requestAnimationFrame(() => {
    rootElement.querySelectorAll<HTMLElement>('[data-id]').forEach((row) => {
      const prevRect = initialPositions.get(row.getAttribute('data-id') ?? '');
      if (!prevRect) {
        return;
      }
      const deltaY = prevRect.top - row.getBoundingClientRect().top;
      if (Math.abs(deltaY) > 1) {
        row.animate([{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }], {
          duration: 200,
          easing: 'ease-in-out',
          fill: 'forwards',
        });
      }
    });
  });
}
