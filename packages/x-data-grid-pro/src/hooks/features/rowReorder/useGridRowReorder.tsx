'use client';
import * as React from 'react';
import { MuiEvent, RefObject } from '@mui/x-internals/types';
import useTimeout from '@mui/utils/useTimeout';
import composeClasses from '@mui/utils/composeClasses';
import {
  useGridLogger,
  useGridEvent,
  type GridEventListener,
  getDataGridUtilityClass,
  useGridSelector,
  gridSortModelSelector,
  useGridEventPriority,
  gridRowNodeSelector,
  type GridRowId,
  gridRowMaximumTreeDepthSelector,
  type GridGroupNode,
  useGridApiMethod,
  gridExpandedSortedRowIdsSelector,
  gridRowTreeSelector,
  gridExpandedSortedRowIndexLookupSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid';
import {
  gridEditRowsStateSelector,
  useGridRegisterPipeProcessor,
  type GridPipeProcessor,
  type GridStateInitializer,
  type RowReorderDropPosition,
  type RowReorderDragDirection,
} from '@mui/x-data-grid/internals';
import { GridRowOrderChangeParams } from '../../../models/gridRowOrderChangeParams';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';
import type { ReorderValidationContext } from './models';

import { findCellElement } from './utils';

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

const TIMEOUT_CLEAR_BUFFER_PX = 5;

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
    'rowReordering' | 'onRowOrderChange' | 'classes' | 'treeData' | 'isValidRowReorder'
  >,
): void => {
  const {
    rowReordering,
    onRowOrderChange,
    classes: classesProp,
    treeData,
    isValidRowReorder,
  } = props;
  const logger = useGridLogger(apiRef, 'useGridRowReorder');
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const dragRowNode = React.useRef<HTMLElement | null>(null);
  const originRowIndex = React.useRef<number | null>(null);
  const removeDnDStylesTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const ownerState = { classes: classesProp };
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

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  // TODO: remove sortModel check once row reorder is sorting compatible
  const isRowReorderDisabled = React.useMemo((): boolean => {
    return !rowReordering || !!sortModel.length;
  }, [rowReordering, sortModel]);

  const calculateDropPosition = React.useCallback(
    (event: MuiEvent<React.DragEvent<HTMLElement>>): RowReorderDropPosition => {
      // For tree data, we need to find the cell element to avoid flickerings on top 20% selection
      const targetElement = treeData ? findCellElement(event.target) : (event.target as Element);
      const targetRect = targetElement.getBoundingClientRect();
      const relativeY = Math.floor(event.clientY - targetRect.top);

      if (treeData) {
        // For tree data: top 20% = above, middle 60% = over, bottom 20% = below
        const topThreshold = targetRect.height * 0.2;
        const bottomThreshold = targetRect.height * 0.8;

        if (relativeY < topThreshold) {
          return 'above';
        }
        if (relativeY > bottomThreshold) {
          return 'below';
        }
        return 'inside';
      }
      // For flat data and row grouping: split at midpoint
      const midPoint = targetRect.height / 2;
      return relativeY < midPoint ? 'above' : 'below';
    },
    [treeData],
  );

  const applyDraggedState = React.useCallback(
    (rowId: GridRowId | null, isDragged: boolean) => {
      if (rowId) {
        const draggedRow = apiRef.current.rootElementRef?.current?.querySelector(
          `[data-id="${rowId}"]`,
        );
        if (draggedRow) {
          if (isDragged) {
            draggedRow.classList.add(classes.rowBeingDragged);
          } else {
            draggedRow.classList.remove(classes.rowBeingDragged);
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

      const visibleRows = rootElement.querySelectorAll('[data-id]');
      if (!visibleRows.length) {
        return;
      }

      const rowsArray = Array.from(visibleRows) as HTMLElement[];

      const initialPositions = new Map<string, DOMRect>();
      rowsArray.forEach((row) => {
        const rowId = row.getAttribute('data-id');
        if (rowId) {
          initialPositions.set(rowId, row.getBoundingClientRect());
        }
      });

      await callback();

      // Use `requestAnimationFrame` to ensure DOM has updated
      requestAnimationFrame(() => {
        const newRows = rootElement.querySelectorAll('[data-id]') as NodeListOf<HTMLElement>;
        const animations: Animation[] = [];

        newRows.forEach((row) => {
          const rowId = row.getAttribute('data-id');
          if (!rowId) {
            return;
          }

          const prevRect = initialPositions.get(rowId);
          if (!prevRect) {
            return;
          }

          const currentRect = row.getBoundingClientRect();
          const deltaY = prevRect.top - currentRect.top;

          if (Math.abs(deltaY) > 1) {
            const animation = row.animate(
              [{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }],
              {
                duration: 200,
                easing: 'ease-in-out',
                fill: 'forwards',
              },
            );

            animations.push(animation);
          }
        });
        if (animations.length > 0) {
          Promise.allSettled(animations.map((a) => a.finished)).then(() => {});
        }
      });
    },
    [apiRef],
  );

  const handleDragStart = React.useCallback<GridEventListener<'rowDragStart'>>(
    (params, event) => {
      // Call the gridEditRowsStateSelector directly to avoid infnite loop
      const editRowsState = gridEditRowsStateSelector(apiRef);
      event.dataTransfer.effectAllowed = 'copy';
      if (isRowReorderDisabled || Object.keys(editRowsState).length !== 0) {
        return;
      }

      if (timeoutInfoRef.current) {
        timeout.clear();
        timeoutInfoRef.current = EMPTY_TIMEOUT_INFO;
      }

      logger.debug(`Start dragging row ${params.id}`);
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
      dragRowNode.current.classList.add(classes.rowDragging);
      setDragRowId(params.id);

      // Apply the dragged state to the entire row
      applyDraggedState(params.id, true);

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragRowNode.current!.classList.remove(classes.rowDragging);
      });

      const sortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      originRowIndex.current = sortedRowIndexLookup[params.id];
      apiRef.current.setCellFocus(params.id, GRID_REORDER_COL_DEF.field);
    },
    [apiRef, isRowReorderDisabled, logger, classes.rowDragging, applyDraggedState, timeout],
  );

  const handleDragOver = React.useCallback<GridEventListener<'cellDragOver' | 'rowDragOver'>>(
    (params, event) => {
      if (dragRowId === '') {
        return;
      }

      const targetNode = gridRowNodeSelector(apiRef, params.id);
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

      logger.debug(`Dragging over row ${params.id}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      if (
        timeoutInfoRef.current &&
        (timeoutInfoRef.current.rowId !== params.id ||
          // Avoid accidental opening of node when the user is moving over a row
          event.clientY > timeoutInfoRef.current.clientY! + TIMEOUT_CLEAR_BUFFER_PX ||
          event.clientY < timeoutInfoRef.current.clientY! - TIMEOUT_CLEAR_BUFFER_PX ||
          event.clientX > timeoutInfoRef.current.clientX! + TIMEOUT_CLEAR_BUFFER_PX ||
          event.clientX < timeoutInfoRef.current.clientX! - TIMEOUT_CLEAR_BUFFER_PX)
      ) {
        timeout.clear();
        timeoutInfoRef.current = EMPTY_TIMEOUT_INFO;
      }

      // Calculate drop position using new logic
      const dropPosition = calculateDropPosition(event);

      if (
        targetNode.type === 'group' &&
        !targetNode.childrenExpanded &&
        !timeoutInfoRef.current.rowId &&
        targetNode.id !== sourceNode.id &&
        (dropPosition === 'inside' || targetNode.depth < sourceNode.depth)
      ) {
        timeout.start(500, () => {
          const rowNode = gridRowNodeSelector(apiRef, params.id) as GridGroupNode;
          // TODO: Handle `dataSource` case with https://github.com/mui/mui-x/issues/18947
          apiRef.current.setRowChildrenExpansion(params.id, !rowNode.childrenExpanded);
        });
        timeoutInfoRef.current = {
          rowId: params.id,
          clientY: event.clientY,
          clientX: event.clientX,
        };
        return;
      }

      const sortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const targetRowIndex = sortedRowIndexLookup[params.id];
      const sourceRowIndex = sortedRowIndexLookup[dragRowId];

      const currentReorderState: ReorderStateProps = {
        dragDirection: targetRowIndex < sourceRowIndex ? 'up' : 'down',
        previousTargetId: params.id,
        previousDropPosition: dropPosition,
      };

      // Update visual indicator when dragging over a different row or position
      if (
        previousReorderState.current.previousTargetId !== params.id ||
        previousReorderState.current.previousDropPosition !== dropPosition
      ) {
        const isSameNode = targetRowIndex === sourceRowIndex;

        // Check if this is an adjacent position
        const isAdjacentPosition =
          (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
          (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1);

        const isRowReorderValid = apiRef.current.unstable_applyPipeProcessors(
          'isRowReorderValid',
          false,
          {
            sourceRowId: dragRowId,
            targetRowId: params.id,
            dropPosition,
            dragDirection: currentReorderState.dragDirection as RowReorderDragDirection,
          },
        );

        // Show drop indicator for valid drops OR adjacent positions OR same node
        if (isRowReorderValid || isAdjacentPosition || isSameNode) {
          dropTarget.current = {
            targetRowId: params.id,
            targetRowIndex,
            dropPosition,
          };
          // Update state with drop target
          apiRef.current.setState((state) => ({
            ...state,
            rowReorder: {
              ...state.rowReorder,
              dropTarget: {
                rowId: params.id,
                position: dropPosition,
              },
            },
          }));
        } else {
          // Clear indicators for invalid drops
          dropTarget.current = {
            targetRowId: null,
            targetRowIndex: null,
            dropPosition: null,
          };
          // Clear state drop target
          apiRef.current.setState((state) => ({
            ...state,
            rowReorder: {
              ...state.rowReorder,
              dropTarget: undefined,
            },
          }));
        }
        previousReorderState.current = currentReorderState;
      }

      // Render the native 'copy' cursor for additional visual feedback
      if (dropTarget.current.targetRowId === null) {
        event.dataTransfer.dropEffect = 'none';
      } else {
        event.dataTransfer.dropEffect = 'copy';
      }
    },
    [dragRowId, apiRef, logger, timeout, calculateDropPosition],
  );

  const handleDragEnd = React.useCallback<GridEventListener<'rowDragEnd'>>(
    async (_, event): Promise<void> => {
      // Call the gridEditRowsStateSelector directly to avoid infnite loop
      const editRowsState = gridEditRowsStateSelector(apiRef);
      if (dragRowId === '' || isRowReorderDisabled || Object.keys(editRowsState).length !== 0) {
        return;
      }

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
        // Reset drop target state
        dropTarget.current = {
          targetRowId: null,
          targetRowIndex: null,
          dropPosition: null,
        };
        originRowIndex.current = null;
        setDragRowId('');
        // Clear visual indicators and dragged state
        applyDraggedState(dragRowId, false);
        apiRef.current.setState((state) => ({
          ...state,
          rowReorder: {
            isActive: false,
            draggedRowId: null,
          },
        }));
        return;
      }
      if (dropTarget.current.targetRowIndex !== null && dropTarget.current.targetRowId !== null) {
        const isRowReorderValid = apiRef.current.unstable_applyPipeProcessors(
          'isRowReorderValid',
          false,
          {
            sourceRowId: dragRowId,
            targetRowId: dropTarget.current.targetRowId,
            dropPosition: dropTarget.current.dropPosition!,
            dragDirection: dragDirection!,
          },
        );

        if (isRowReorderValid) {
          try {
            const rowTree = gridRowTreeSelector(apiRef);
            const sourceNode = gridRowNodeSelector(apiRef, dragRowId);

            if (!sourceNode) {
              throw new Error(`MUI X: No row node found for id #${dragRowId}`);
            }

            // Calculate oldParent and oldIndex
            const oldParent = sourceNode.parent!;
            const oldParentNode = rowTree[oldParent] as GridGroupNode;
            const oldIndexInParent =
              oldParentNode.children.indexOf(dragRowId) ?? originRowIndex.current;

            await applyRowAnimation(async () => {
              await apiRef.current.setRowPosition(
                dragRowId,
                dropTarget.current.targetRowId!,
                dropTarget.current.dropPosition as RowReorderDropPosition,
              );

              const updatedTree = gridRowTreeSelector(apiRef);
              const updatedNode = updatedTree[dragRowId];

              if (!updatedNode) {
                throw new Error(`MUI X: Row node for id #${dragRowId} not found after move`);
              }

              const newParent = updatedNode.parent!;
              const newParentNode = updatedTree[newParent] as GridGroupNode;
              const newIndexInParent = newParentNode.children.indexOf(dragRowId);

              // Only emit event and clear state after successful reorder
              const rowOrderChangeParams: GridRowOrderChangeParams = {
                row: apiRef.current.getRow(dragRowId)!,
                oldIndex: oldIndexInParent,
                targetIndex: newIndexInParent,
                oldParent: oldParent === GRID_ROOT_GROUP_ID ? null : oldParent,
                newParent: newParent === GRID_ROOT_GROUP_ID ? null : newParent,
              };

              applyDraggedState(dragRowId, false);
              apiRef.current.setState((state) => ({
                ...state,
                rowReorder: {
                  isActive: false,
                  draggedRowId: null,
                },
              }));

              apiRef.current.publishEvent('rowOrderChange', rowOrderChangeParams);
            });
          } catch (error) {
            // Handle error: reset visual state but don't publish success event
            applyDraggedState(dragRowId, false);
            apiRef.current.setState((state) => ({
              ...state,
              rowReorder: {
                isActive: false,
                draggedRowId: null,
              },
            }));
          }
        } else {
          applyDraggedState(dragRowId, false);
          apiRef.current.setState((state) => ({
            ...state,
            rowReorder: {
              ...state.rowReorder,
              dropTarget: undefined,
            },
          }));
        }
      }

      // Reset drop target state
      dropTarget.current = {
        targetRowId: null,
        targetRowIndex: null,
        dropPosition: null,
      };

      setDragRowId('');
    },
    [
      apiRef,
      dragRowId,
      isRowReorderDisabled,
      logger,
      applyDraggedState,
      timeout,
      applyRowAnimation,
    ],
  );

  const isValidRowReorderProp = isValidRowReorder;
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
  useGridEventPriority(apiRef, 'rowOrderChange', onRowOrderChange);

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
