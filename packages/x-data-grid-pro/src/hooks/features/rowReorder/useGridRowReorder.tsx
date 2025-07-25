'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
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
} from '@mui/x-data-grid';
import {
  gridEditRowsStateSelector,
  type GridPipeProcessor,
  gridExpandedSortedRowIndexLookupSelector,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
import { GridRowOrderChangeParams } from '../../../models/gridRowOrderChangeParams';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

type GridRowReorderDirection = 'up' | 'down';

interface ReorderStateProps {
  previousTargetId: GridRowId | null;
  dragDirection: GridRowReorderDirection | null;
  previousDropPosition: 'above' | 'below' | null;
}

const EMPTY_REORDER_STATE: ReorderStateProps = {
  previousTargetId: null,
  dragDirection: null,
  previousDropPosition: null,
};

interface DropTarget {
  targetRowId: GridRowId | null;
  targetRowIndex: number | null;
  dropPosition: 'above' | 'below' | null;
}

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    rowDragging: ['row--dragging'],
    rowDropAbove: ['row--dropAbove'],
    rowDropBelow: ['row--dropBelow'],
    rowBeingDragged: ['row--beingDragged'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

/**
 * Hook for row reordering (Pro package)
 * @requires useGridRows (method)
 */
export const useGridRowReorder = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'rowReordering' | 'onRowOrderChange' | 'classes' | 'treeData' | 'dataSource'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRowReorder');
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const dragRowNode = React.useRef<HTMLElement | null>(null);
  const originRowIndex = React.useRef<number | null>(null);
  const removeDnDStylesTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const previousDropIndicatorRef = React.useRef<HTMLElement | null>(null);
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);
  const [dragRowId, setDragRowId] = React.useState<GridRowId>('');
  const sortedRowIndexLookup = useGridSelector(apiRef, gridExpandedSortedRowIndexLookupSelector);
  const timeoutRowId = React.useRef<GridRowId>('');
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
  // remove treeData check once row reorder is treeData compatible
  const isRowReorderDisabled = React.useMemo((): boolean => {
    return !props.rowReordering || !!sortModel.length || props.treeData;
  }, [props.rowReordering, sortModel, props.treeData]);

  const applyDropIndicator = React.useCallback(
    (targetRowId: GridRowId | null, position: 'above' | 'below' | null) => {
      // Remove existing drop indicator from previous target
      if (previousDropIndicatorRef.current) {
        previousDropIndicatorRef.current.classList.remove(
          classes.rowDropAbove,
          classes.rowDropBelow,
        );
        previousDropIndicatorRef.current = null;
      }

      // Apply new drop indicator
      if (targetRowId !== undefined && position !== null) {
        const targetRow = apiRef.current.rootElementRef?.current?.querySelector(
          `[data-id="${targetRowId}"]`,
        );
        if (targetRow) {
          targetRow.classList.add(
            position === 'above' ? classes.rowDropAbove : classes.rowDropBelow,
          );
          previousDropIndicatorRef.current = targetRow as HTMLElement;
        }
      }
    },
    [apiRef, classes],
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
    (callback: () => void) => {
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

      callback();

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

      if (timeoutRowId.current) {
        timeout.clear();
        timeoutRowId.current = '';
      }

      logger.debug(`Start dragging row ${params.id}`);
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      dragRowNode.current = event.currentTarget;
      // Apply cell-level dragging class to the drag handle
      dragRowNode.current.classList.add(classes.rowDragging);
      setDragRowId(params.id);

      // Apply the dragged state to the entire row
      applyDraggedState(params.id, true);

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragRowNode.current!.classList.remove(classes.rowDragging);
      });

      originRowIndex.current = sortedRowIndexLookup[params.id];
      apiRef.current.setCellFocus(params.id, GRID_REORDER_COL_DEF.field);
    },
    [
      apiRef,
      isRowReorderDisabled,
      logger,
      classes.rowDragging,
      applyDraggedState,
      sortedRowIndexLookup,
      timeout,
    ],
  );

  const handleDragOver = React.useCallback<GridEventListener<'cellDragOver' | 'rowDragOver'>>(
    (params, event) => {
      if (dragRowId === '') {
        return;
      }

      const targetNode = gridRowNodeSelector(apiRef, params.id);

      if (
        !targetNode ||
        targetNode.type === 'footer' ||
        targetNode.type === 'pinnedRow' ||
        !event.target
      ) {
        return;
      }

      // Find the relative 'y' mouse position based on the event.target
      const targetRect = (event.target as Element).getBoundingClientRect();
      const relativeY = Math.floor(event.clientY - targetRect.top);
      const midPoint = Math.floor(targetRect.height / 2);

      logger.debug(`Dragging over row ${params.id}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      if (timeoutRowId.current !== params.id) {
        timeout.clear();
        timeoutRowId.current = '';
      }

      if (params.id !== dragRowId) {
        const sourceNode = gridRowNodeSelector(apiRef, dragRowId);

        if (
          sourceNode.type === 'leaf' &&
          targetNode.type === 'group' &&
          targetNode.depth < sourceNode.depth &&
          !targetNode.childrenExpanded &&
          !timeoutRowId.current
        ) {
          timeout.start(500, () => {
            const rowNode = gridRowNodeSelector(apiRef, params.id) as GridGroupNode;
            if (!rowNode.childrenExpanded && props.dataSource) {
              // always fetch/get from cache the children when the node is expanded
              apiRef.current.dataSource.fetchRows(params.id);
            }
            apiRef.current.setRowChildrenExpansion(params.id, !rowNode.childrenExpanded);
          });
          timeoutRowId.current = params.id;
          return;
        }

        const targetRowIndex = sortedRowIndexLookup[params.id];
        const sourceRowIndex = sortedRowIndexLookup[dragRowId];

        // Determine drop position based on relativeY position within the row
        const dropPosition = relativeY < midPoint ? 'above' : 'below';

        const currentReorderState: ReorderStateProps = {
          dragDirection: targetRowIndex < sourceRowIndex ? 'up' : 'down',
          previousTargetId: params.id,
          previousDropPosition: dropPosition,
        };

        // Only update visual indicator:
        // 1. When dragging over a different row
        // 2. When it would result in actual movement
        if (
          previousReorderState.current.previousTargetId !== params.id ||
          previousReorderState.current.previousDropPosition !== dropPosition
        ) {
          const finalTargetIndex = apiRef.current.unstable_applyPipeProcessors(
            'getRowReorderTargetIndex',
            -1,
            {
              sourceRowId: dragRowId,
              targetRowId: params.id,
              dropPosition,
              dragDirection: currentReorderState.dragDirection as GridRowReorderDirection,
            },
          );
          if (finalTargetIndex >= 0) {
            dropTarget.current = {
              targetRowId: params.id,
              targetRowIndex,
              dropPosition,
            };
            applyDropIndicator(params.id, dropPosition);
          } else {
            // Clear any existing indicators since this wouldn't result in movement
            dropTarget.current = {
              targetRowId: null,
              targetRowIndex: null,
              dropPosition: null,
            };
            applyDropIndicator(null, null);
          }
          previousReorderState.current = currentReorderState;
        }
      } else if (previousReorderState.current.previousTargetId !== null) {
        dropTarget.current = {
          targetRowId: null,
          targetRowIndex: null,
          dropPosition: null,
        };
        applyDropIndicator(null, null);
        previousReorderState.current = {
          previousTargetId: null,
          dragDirection: null,
          previousDropPosition: null,
        };
      }

      // Render the native 'copy' cursor for additional visual feedback
      if (dropTarget.current.targetRowId === null) {
        event.dataTransfer.dropEffect = 'none';
      } else {
        event.dataTransfer.dropEffect = 'copy';
      }
    },
    [
      dragRowId,
      apiRef,
      logger,
      timeout,
      sortedRowIndexLookup,
      applyDropIndicator,
      props.dataSource,
    ],
  );

  const handleDragEnd = React.useCallback<GridEventListener<'rowDragEnd'>>(
    (_, event): void => {
      // Call the gridEditRowsStateSelector directly to avoid infnite loop
      const editRowsState = gridEditRowsStateSelector(apiRef);
      if (dragRowId === '' || isRowReorderDisabled || Object.keys(editRowsState).length !== 0) {
        return;
      }

      if (timeoutRowId.current) {
        timeout.clear();
        timeoutRowId.current = '';
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

      // Clear visual indicators and dragged state
      applyDropIndicator(null, null);
      applyDraggedState(dragRowId, false);

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
        return;
      }
      if (dropTarget.current.targetRowIndex !== null && dropTarget.current.targetRowId !== null) {
        const sourceRowIndex = originRowIndex.current!;
        const targetRowIndex = dropTarget.current.targetRowIndex;

        const finalTargetIndex = apiRef.current.unstable_applyPipeProcessors(
          'getRowReorderTargetIndex',
          targetRowIndex,
          {
            sourceRowId: dragRowId,
            targetRowId: dropTarget.current.targetRowId,
            dropPosition: dropTarget.current.dropPosition!,
            dragDirection: dragDirection!,
          },
        );

        if (finalTargetIndex !== -1) {
          applyRowAnimation(() => {
            apiRef.current.setRowIndex(dragRowId, finalTargetIndex);

            // Emit the rowOrderChange event only once when the reordering stops.
            const rowOrderChangeParams: GridRowOrderChangeParams = {
              row: apiRef.current.getRow(dragRowId)!,
              targetIndex: targetRowIndex,
              oldIndex: sourceRowIndex,
            };

            apiRef.current.publishEvent('rowOrderChange', rowOrderChangeParams);
          });
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
      applyDropIndicator,
      applyDraggedState,
      timeout,
      applyRowAnimation,
    ],
  );

  const getRowReorderTargetIndex = React.useCallback<GridPipeProcessor<'getRowReorderTargetIndex'>>(
    (initialValue, { sourceRowId, targetRowId, dropPosition, dragDirection }) => {
      if (gridRowMaximumTreeDepthSelector(apiRef) > 1) {
        return initialValue;
      }

      const targetRowIndex = sortedRowIndexLookup[targetRowId];
      const sourceRowIndex = sortedRowIndexLookup[sourceRowId];

      // Check if this drop would result in no actual movement
      const isAdjacentNode =
        (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) || // dragging to immediately below (above next row)
        (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1); // dragging to immediately above (below previous row)

      if (isAdjacentNode) {
        // Return -1 to indicate that the row should not be reordered
        return -1;
      }

      let finalTargetIndex;
      if (dragDirection === 'up') {
        finalTargetIndex = dropPosition === 'above' ? targetRowIndex : targetRowIndex + 1;
      } else {
        finalTargetIndex = dropPosition === 'above' ? targetRowIndex - 1 : targetRowIndex;
      }
      return finalTargetIndex;
    },
    [apiRef, sortedRowIndexLookup],
  );

  useGridRegisterPipeProcessor(apiRef, 'getRowReorderTargetIndex', getRowReorderTargetIndex);
  useGridEvent(apiRef, 'rowDragStart', handleDragStart);
  useGridEvent(apiRef, 'rowDragOver', handleDragOver);
  useGridEvent(apiRef, 'rowDragEnd', handleDragEnd);
  useGridEvent(apiRef, 'cellDragOver', handleDragOver);
  useGridEventPriority(apiRef, 'rowOrderChange', props.onRowOrderChange);
};
