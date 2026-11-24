'use client';
import * as React from 'react';
import type { MuiEvent, RefObject } from '@mui/x-internals/types';
import useTimeout from '@mui/utils/useTimeout';
import composeClasses from '@mui/utils/composeClasses';
import {
  useGridLogger,
  useGridEvent,
  getDataGridUtilityClass,
  gridClasses,
  useGridSelector,
  gridSortModelSelector,
  useGridEventPriority,
  gridRowNodeSelector,
  gridRowMaximumTreeDepthSelector,
  useGridApiMethod,
  gridExpandedSortedRowIdsSelector,
  gridRowTreeSelector,
  gridExpandedSortedRowIndexLookupSelector,
} from '@mui/x-data-grid';
import type { GridEventListener, GridRowId } from '@mui/x-data-grid';
import {
  gridEditRowsStateSelector,
  getVisibleRows,
  gridIsRowDragActiveSelector,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
import type {
  GridPipeProcessor,
  GridStateInitializer,
  RowReorderDropPosition,
  RowReorderDragDirection,
} from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';
import type { ReorderValidationContext } from './models';

import { addClasses, removeClasses } from '../../../utils/classListUtils';
import { findCellElement } from './utils';
import {
  EXPAND_DELAY,
  animateRowMove,
  commitRowReorder,
  evaluateRowDropTarget,
  getRowDropPosition,
  getRowIdFromElement,
  hasLeftPendingExpansion,
  isRowReorderAllowed,
  checkRowReorderValid,
  setRowReorderDropTarget,
  shouldExpandGroupOnHover,
  toggleHoveredGroupExpansion,
} from './rowReorderDragUtils';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

interface ReorderStateProps {
  previousTargetId: GridRowId | null;
  dragDirection: RowReorderDragDirection | null;
  previousDropPosition: RowReorderDropPosition | null;
}

const EMPTY_REORDER_STATE: ReorderStateProps = {
  previousTargetId: null,
  dragDirection: null,
  previousDropPosition: null,
};

interface DropTarget {
  targetRowId: GridRowId | null;
  targetRowIndex: number | null;
  dropPosition: RowReorderDropPosition | null;
}

interface TimeoutInfo {
  rowId: GridRowId | null;
  clientX?: number;
  clientY?: number;
}

const EMPTY_TIMEOUT_INFO: TimeoutInfo = {
  rowId: null,
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    rowDragging: ['row--dragging'],
    rowBeingDragged: ['row--beingDragged'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const rowReorderStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  rowReorder: {
    isActive: false,
  },
});

/**
 * Hook for row reordering (Pro package)
 * @requires useGridRows (method)
 */
export const useGridRowReorder = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'rowReordering'
    | 'onRowOrderChange'
    | 'classes'
    | 'treeData'
    | 'dataSource'
    | 'isValidRowReorder'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRowReorder');
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const dragRowNode = React.useRef<HTMLElement | null>(null);
  const removeDnDStylesTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);
  const [dragRowId, setDragRowId] = React.useState<GridRowId>('');
  const timeoutInfoRef = React.useRef<TimeoutInfo>(EMPTY_TIMEOUT_INFO);
  const timeout = useTimeout();
  const previousReorderState = React.useRef<ReorderStateProps>(EMPTY_REORDER_STATE);
  const dropTarget = React.useRef<DropTarget>({
    targetRowId: null,
    targetRowIndex: null,
    dropPosition: null,
  });
  // A new object for each started drag, to tell whether a newer drag started while a drop was committing
  const currentDragRef = React.useRef<{ rowId: GridRowId } | null>(null);

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  const isRowReorderAllowedNow = React.useCallback(
    (): boolean =>
      isRowReorderAllowed({
        rowReordering: props.rowReordering,
        sortModel,
        // Call the gridEditRowsStateSelector directly to avoid infnite loop
        editRowsState: gridEditRowsStateSelector(apiRef),
      }),
    [apiRef, props.rowReordering, sortModel],
  );

  const calculateDropPosition = React.useCallback(
    (event: Pick<DragEvent, 'target' | 'clientY'>): RowReorderDropPosition => {
      // For tree data, we need to find the cell element to avoid flickerings on top 20% selection
      const targetElement = props.treeData
        ? findCellElement(event.target)
        : (event.target as Element);
      return getRowDropPosition(targetElement, event.clientY, !!props.treeData);
    },
    [props.treeData],
  );

  const applyDraggedState = React.useCallback(
    (rowId: GridRowId | null, isDragged: boolean) => {
      if (rowId) {
        const draggedRow = apiRef.current.rootElementRef?.current?.querySelector(
          `[data-id="${rowId}"]`,
        );
        if (draggedRow) {
          if (isDragged) {
            addClasses(draggedRow, classes.rowBeingDragged);
          } else {
            removeClasses(draggedRow, classes.rowBeingDragged);
          }
        }
      }
    },
    [apiRef, classes.rowBeingDragged],
  );

  const applyRowAnimation = React.useCallback(
    async (callback: () => void | Promise<void>) => {
      const rootElement = apiRef.current.rootElementRef?.current;
      if (!rootElement) {
        return;
      }

      // Without rendered rows, the move is skipped and the drag end cleanup resets the state
      if (!rootElement.querySelector('[data-id]')) {
        return;
      }

      await animateRowMove(rootElement, callback);
    },
    [apiRef],
  );

  const handleDragStart = React.useCallback<GridEventListener<'rowDragStart'>>(
    (params, event) => {
      event.dataTransfer.effectAllowed = 'copy';
      if (!isRowReorderAllowedNow()) {
        return;
      }

      if (timeoutInfoRef.current) {
        timeout.clear();
        timeoutInfoRef.current = EMPTY_TIMEOUT_INFO;
      }

      logger.debug(`Start dragging row ${params.id}`);
      currentDragRef.current = { rowId: params.id };
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      apiRef.current.setState((state) => ({
        ...state,
        rowReorder: {
          ...state.rowReorder,
          isActive: true,
          draggedRowId: params.id,
        },
      }));

      dragRowNode.current = event.currentTarget;
      // Apply cell-level dragging class to the drag handle
      addClasses(dragRowNode.current, classes.rowDragging);
      setDragRowId(params.id);

      // Apply the dragged state to the entire row
      applyDraggedState(params.id, true);

      removeDnDStylesTimeout.current = setTimeout(() => {
        removeClasses(dragRowNode.current, classes.rowDragging);
      });

      apiRef.current.setCellFocus(params.id, GRID_REORDER_COL_DEF.field);
    },
    [apiRef, isRowReorderAllowedNow, logger, classes.rowDragging, applyDraggedState, timeout],
  );

  const handleDragOverRow = React.useCallback(
    (
      rowId: GridRowId,
      event: MuiEvent<React.DragEvent<HTMLElement>> | DragEvent,
      dropPosition: RowReorderDropPosition,
    ) => {
      if (dragRowId === '') {
        return;
      }

      const targetNode = gridRowNodeSelector(apiRef, rowId);
      const sourceNode = gridRowNodeSelector(apiRef, dragRowId);

      if (
        !sourceNode ||
        !targetNode ||
        targetNode.type === 'footer' ||
        targetNode.type === 'pinnedRow' ||
        !event.target
      ) {
        return;
      }

      logger.debug(`Dragging over row ${rowId}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      if (
        timeoutInfoRef.current &&
        // Avoid accidental opening of node when the user is moving over a row
        hasLeftPendingExpansion(timeoutInfoRef.current, rowId, event.clientX, event.clientY)
      ) {
        timeout.clear();
        timeoutInfoRef.current = EMPTY_TIMEOUT_INFO;
      }

      if (
        !timeoutInfoRef.current.rowId &&
        shouldExpandGroupOnHover(sourceNode, targetNode, dropPosition)
      ) {
        timeout.start(EXPAND_DELAY, () => toggleHoveredGroupExpansion(apiRef, rowId));
        timeoutInfoRef.current = {
          rowId,
          clientY: event.clientY,
          clientX: event.clientX,
        };
        return;
      }

      // Update visual indicator when dragging over a different row or position
      if (
        previousReorderState.current.previousTargetId !== rowId ||
        previousReorderState.current.previousDropPosition !== dropPosition
      ) {
        const { dragDirection, targetRowIndex, showIndicator } = evaluateRowDropTarget(
          apiRef,
          dragRowId,
          rowId,
          dropPosition,
        );

        // Show drop indicator for valid drops OR adjacent positions OR same node
        if (showIndicator) {
          dropTarget.current = {
            targetRowId: rowId,
            targetRowIndex,
            dropPosition,
          };
          setRowReorderDropTarget(apiRef, { rowId, position: dropPosition });
        } else {
          // Clear indicators for invalid drops
          dropTarget.current = {
            targetRowId: null,
            targetRowIndex: null,
            dropPosition: null,
          };
          setRowReorderDropTarget(apiRef, undefined);
        }
        previousReorderState.current = {
          dragDirection,
          previousTargetId: rowId,
          previousDropPosition: dropPosition,
        };
      }

      // Render the native 'copy' cursor for additional visual feedback
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = dropTarget.current.targetRowId === null ? 'none' : 'copy';
      }
    },
    [dragRowId, apiRef, logger, timeout],
  );

  const handleDragOver = React.useCallback<GridEventListener<'cellDragOver' | 'rowDragOver'>>(
    (params, event) => {
      if (dragRowId !== '') {
        handleDragOverRow(params.id, event, calculateDropPosition(event));
      }
    },
    [dragRowId, handleDragOverRow, calculateDropPosition],
  );

  // Rows and cells stop the propagation of the drag over events they handle,
  // so this listener only receives the ones happening outside of the rows.
  React.useEffect(() => {
    const mainElement = apiRef.current.mainElementRef?.current;
    if (dragRowId === '' || !mainElement) {
      return undefined;
    }

    // Removes the drop indicator when dragging where the row can't be dropped
    const clearDropTarget = () => {
      if (dropTarget.current.targetRowId === null) {
        return;
      }
      dropTarget.current = { targetRowId: null, targetRowIndex: null, dropPosition: null };
      previousReorderState.current = {
        ...previousReorderState.current,
        previousTargetId: null,
        previousDropPosition: null,
      };
      setRowReorderDropTarget(apiRef, undefined);
    };

    const findDropTarget = (
      event: DragEvent,
    ): { rowId: GridRowId; dropPosition: RowReorderDropPosition } | null => {
      const { rows } = getVisibleRows(apiRef);
      if (rows.length === 0) {
        return null;
      }

      // The scroll areas cover the first and last visible rows: drop on the row under the pointer
      if (
        mainElement.contains(event.target as Node) &&
        (event.target as Element).closest(`.${gridClasses.scrollArea}`)
      ) {
        const elementUnder = document
          .elementsFromPoint(event.clientX, event.clientY)
          .find(
            (element) =>
              mainElement.contains(element) &&
              !element.closest(`.${gridClasses.scrollArea}`) &&
              element.closest('[role="row"]'),
          );
        const rowElement = elementUnder?.closest('[role="row"]');
        const rowId = rowElement ? getRowIdFromElement(apiRef, rowElement) : null;
        return rowId === null
          ? null
          : {
              rowId,
              dropPosition: calculateDropPosition({
                target: elementUnder!,
                clientY: event.clientY,
              }),
            };
      }

      // Empty space below the rows, footer or page below the grid, within the grid's
      // horizontal bounds: drop below the last row of the page, even if it is not rendered
      const lastRowId = rows[rows.length - 1].id;
      const mainRect = mainElement.getBoundingClientRect();
      const rowsBottom = Math.min(
        mainRect.bottom,
        apiRef.current.getRowElement(lastRowId)?.getBoundingClientRect().bottom ?? Infinity,
      );
      if (
        event.clientY <= rowsBottom ||
        event.clientX < mainRect.left ||
        event.clientX > mainRect.right
      ) {
        return null;
      }
      return { rowId: lastRowId, dropPosition: 'below' };
    };

    const handleDragOverOutsideRows = (event: DragEvent) => {
      const target = findDropTarget(event);
      // Rows not loaded yet (lazy loading) are replaced once fetched, so they can't be targeted
      if (target && gridRowNodeSelector(apiRef, target.rowId)?.type !== 'skeletonRow') {
        handleDragOverRow(target.rowId, event, target.dropPosition);
      } else {
        clearDropTarget();
      }
    };

    const ownerDocument = mainElement.ownerDocument;
    ownerDocument.addEventListener('dragover', handleDragOverOutsideRows);
    return () => {
      ownerDocument.removeEventListener('dragover', handleDragOverOutsideRows);
    };
  }, [apiRef, dragRowId, handleDragOverRow, calculateDropPosition]);

  // A drag session can end without a valid drop: no drop target, a rejected drop,
  // or a reorder that got disabled during the drag. The reorder state must not stay
  // active in these cases, because components like the scroll areas derive their
  // visibility from it. The hook-local values must reset together with the state:
  // a stale `dragRowId` keeps the drag-over handlers acting on a dead drag session.
  const resetRowDragState = React.useCallback(() => {
    dropTarget.current = {
      targetRowId: null,
      targetRowIndex: null,
      dropPosition: null,
    };
    previousReorderState.current = EMPTY_REORDER_STATE;
    dragRowNode.current = null;
    if (dragRowId !== '') {
      applyDraggedState(dragRowId, false);
      setDragRowId('');
    }
    if (gridIsRowDragActiveSelector(apiRef)) {
      apiRef.current.setState((state) => ({
        ...state,
        rowReorder: {
          isActive: false,
          draggedRowId: null,
        },
      }));
    }
  }, [apiRef, dragRowId, applyDraggedState]);

  const handleDragEnd = React.useCallback<GridEventListener<'rowDragEnd'>>(
    async (_, event): Promise<void> => {
      if (dragRowId === '' || !isRowReorderAllowedNow()) {
        resetRowDragState();
        return;
      }

      // The drop can take time to commit, for example with an async `processRowUpdate`.
      // A drag started meanwhile owns the shared state: this drag only reverts its row's style then.
      const drag = currentDragRef.current;
      const resetAfterCommit = () => {
        if (currentDragRef.current === drag) {
          resetRowDragState();
        } else if (currentDragRef.current?.rowId !== dragRowId) {
          applyDraggedState(dragRowId, false);
        }
      };

      if (timeoutInfoRef.current) {
        timeout.clear();
        timeoutInfoRef.current = EMPTY_TIMEOUT_INFO;
      }

      logger.debug('End dragging row');
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      clearTimeout(removeDnDStylesTimeout.current);
      dragRowNode.current = null;
      const dragDirection = previousReorderState.current.dragDirection;
      previousReorderState.current = EMPTY_REORDER_STATE;

      // Check if the row was dropped outside the grid.
      if (!event.dataTransfer || event.dataTransfer.dropEffect === 'none') {
        resetRowDragState();
        return;
      }
      if (dropTarget.current.targetRowIndex !== null && dropTarget.current.targetRowId !== null) {
        const isValid = checkRowReorderValid(apiRef, {
          sourceRowId: dragRowId,
          targetRowId: dropTarget.current.targetRowId,
          dropPosition: dropTarget.current.dropPosition!,
          dragDirection: dragDirection!,
        });

        if (isValid) {
          const { rows } = getVisibleRows(apiRef);
          const isDropAfterLastRow =
            dropTarget.current.dropPosition === 'below' &&
            dropTarget.current.targetRowId === rows[rows.length - 1]?.id;

          // Only emit event and clear state after successful reorder.
          // A failed move is handled inside. It only rejects with the error of a `rowOrderChange` listener,
          // which must reach the user. The state is already clear then.
          await commitRowReorder(
            apiRef,
            dragRowId,
            {
              rowId: dropTarget.current.targetRowId,
              position: dropTarget.current.dropPosition as RowReorderDropPosition,
            },
            applyRowAnimation,
            () => {
              resetAfterCommit();
              // The last row can be out of view when dropping below the grid: show the dropped row
              const virtualScroller = apiRef.current.virtualScrollerRef.current;
              if (isDropAfterLastRow && virtualScroller) {
                apiRef.current.scroll({ top: virtualScroller.scrollHeight });
              }
            },
          );
        }
      }

      // Catch-all cleanup: also covers a rejected drop, a missing drop target,
      // and an animation that bailed out before it ran the reorder callback.
      resetAfterCommit();
    },
    [
      apiRef,
      dragRowId,
      isRowReorderAllowedNow,
      logger,
      timeout,
      applyRowAnimation,
      applyDraggedState,
      resetRowDragState,
    ],
  );

  const isValidRowReorderProp = props.isValidRowReorder;
  const isRowReorderValid = React.useCallback<GridPipeProcessor<'isRowReorderValid'>>(
    (initialValue, { sourceRowId, targetRowId, dropPosition, dragDirection }) => {
      if (gridRowMaximumTreeDepthSelector(apiRef) > 1) {
        return initialValue;
      }

      const sortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const targetRowIndex = sortedRowIndexLookup[targetRowId];
      const sourceRowIndex = sortedRowIndexLookup[sourceRowId];

      // Apply internal validation: check if this drop would result in no actual movement
      const isAdjacentNode =
        (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) || // dragging to immediately below (above next row)
        (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1); // dragging to immediately above (below previous row)

      if (isAdjacentNode || sourceRowIndex === targetRowIndex) {
        return false;
      }

      // Internal validation passed, now apply additional user validation if provided
      if (isValidRowReorderProp) {
        const expandedSortedRowIds = gridExpandedSortedRowIdsSelector(apiRef);
        const rowTree = gridRowTreeSelector(apiRef);

        const sourceNode = rowTree[sourceRowId];
        const targetNode = rowTree[targetRowId];
        const prevNode =
          targetRowIndex > 0 ? rowTree[expandedSortedRowIds[targetRowIndex - 1]] : null;
        const nextNode =
          targetRowIndex < expandedSortedRowIds.length - 1
            ? rowTree[expandedSortedRowIds[targetRowIndex + 1]]
            : null;

        const context: ReorderValidationContext = {
          apiRef,
          sourceNode,
          targetNode,
          prevNode,
          nextNode,
          dropPosition,
          dragDirection,
        };

        if (!isValidRowReorderProp(context)) {
          return false;
        }
      }

      return true;
    },
    [apiRef, isValidRowReorderProp],
  );

  useGridRegisterPipeProcessor(apiRef, 'isRowReorderValid', isRowReorderValid);
  useGridEvent(apiRef, 'rowDragStart', handleDragStart);
  useGridEvent(apiRef, 'rowDragOver', handleDragOver);
  useGridEvent(apiRef, 'rowDragEnd', handleDragEnd);
  useGridEvent(apiRef, 'cellDragOver', handleDragOver);
  useGridEventPriority(apiRef, 'rowOrderChange', props.onRowOrderChange);

  const setRowDragActive = React.useCallback(
    (isActive: boolean) => {
      apiRef.current.setState((state) => ({
        ...state,
        rowReorder: {
          ...state.rowReorder,
          isActive,
        },
      }));
    },
    [apiRef],
  );

  useGridApiMethod(
    apiRef,
    {
      setRowDragActive,
    },
    'private',
  );
};
