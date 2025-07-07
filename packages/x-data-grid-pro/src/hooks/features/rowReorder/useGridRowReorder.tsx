'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import composeClasses from '@mui/utils/composeClasses';
import {
  useGridLogger,
  useGridEvent,
  GridEventListener,
  getDataGridUtilityClass,
  useGridSelector,
  gridSortModelSelector,
  gridRowMaximumTreeDepthSelector,
  useGridEventPriority,
  gridRowNodeSelector,
  GridRowId,
} from '@mui/x-data-grid';
import {
  gridEditRowsStateSelector,
  gridSortedRowIndexLookupSelector,
} from '@mui/x-data-grid/internals';
import { GridRowOrderChangeParams } from '../../../models/gridRowOrderChangeParams';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

enum Direction {
  UP,
  DOWN,
}

interface ReorderStateProps {
  previousTargetId: GridRowId | null;
  dragDirection: Direction | null;
}

interface DropTarget {
  targetRowId: GridRowId | null;
  targetRowIndex: number | null;
  dropPosition: 'above' | 'below' | null;
}

let previousReorderState: ReorderStateProps = {
  previousTargetId: null,
  dragDirection: null,
};

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
 * Only available in DataGridPro
 * @requires useGridRows (method)
 */
export const useGridRowReorder = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'rowReordering' | 'onRowOrderChange' | 'classes'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRowReorder');
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector);
  const dragRowNode = React.useRef<HTMLElement | null>(null);
  const originRowIndex = React.useRef<number | null>(null);
  const removeDnDStylesTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);
  const [dragRowId, setDragRowId] = React.useState<GridRowId>('');
  const sortedRowIndexLookup = useGridSelector(apiRef, gridSortedRowIndexLookupSelector);

  const [dropTarget, setDropTarget] = React.useState<DropTarget>({
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
  // remove treeDepth once row reorder is tree compatible
  const isRowReorderDisabled = React.useMemo((): boolean => {
    return !props.rowReordering || !!sortModel.length || treeDepth !== 1;
  }, [props.rowReordering, sortModel, treeDepth]);

  const applyDropIndicator = React.useCallback(
    (targetRowId: GridRowId | null, position: 'above' | 'below' | null) => {
      // Remove existing drop indicators
      const allRows = apiRef.current.rootElementRef?.current?.querySelectorAll('[data-id]');
      allRows?.forEach((row) => {
        row.classList.remove(classes.rowDropAbove, classes.rowDropBelow);
      });

      // Apply new drop indicator
      if (targetRowId && position) {
        const targetRow = apiRef.current.rootElementRef?.current?.querySelector(
          `[data-id="${targetRowId}"]`,
        );
        if (targetRow) {
          targetRow.classList.add(
            position === 'above' ? classes.rowDropAbove : classes.rowDropBelow,
          );
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
    (draggedRowId: GridRowId, reorderCallback: () => void) => {
      // TODO: Test performance implication
      // Should be good because of the virtualization
      const rootElement = apiRef.current.rootElementRef?.current;
      if (!rootElement) {
        return;
      }

      const allRows = rootElement.querySelectorAll('[data-id]');
      if (!allRows.length) {
        return;
      }

      const rowsArray = Array.from(allRows) as HTMLElement[];

      const initialPositions = new Map<string, DOMRect>();
      rowsArray.forEach((row) => {
        const rowId = row.getAttribute('data-id');
        if (rowId) {
          initialPositions.set(rowId, row.getBoundingClientRect());
        }
      });

      reorderCallback();

      // Use `requestAnimationFrame` to ensure DOM has updated
      requestAnimationFrame(() => {
        const newRows = rootElement.querySelectorAll('[data-id]') as NodeListOf<HTMLElement>;

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

          // Only animate if there's actual movement
          if (Math.abs(deltaY) > 1) {
            // Apply the inverted transform immediately (without transition)
            row.style.transition = 'none';
            row.style.transform = `translateY(${deltaY}px)`;

            // Force a repaint by accessing a property that triggers layout recalculation
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            row.offsetHeight;

            // Apply transition
            row.style.transition = 'transform 0.2s ease-in-out';
            row.style.transform = 'translateY(0)';

            if (rowId !== String(draggedRowId)) {
              row.style.backgroundColor = 'var(--unstable_DataGrid-overlayBackground)';
            }

            // Clean up after animation
            setTimeout(() => {
              row.style.transition = '';
              row.style.transform = '';
              row.style.backgroundColor = '';
            }, 200);
          }
        });
      });
    },
    [apiRef],
  );

  const handleDragStart = React.useCallback<GridEventListener<'rowDragStart'>>(
    (params, event) => {
      // Call the gridEditRowsStateSelector directly to avoid infnite loop
      const editRowsState = gridEditRowsStateSelector(apiRef);
      if (isRowReorderDisabled || Object.keys(editRowsState).length !== 0) {
        return;
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
      sortedRowIndexLookup,
      applyDraggedState,
    ],
  );

  const handleDragOver = React.useCallback<GridEventListener<'cellDragOver' | 'rowDragOver'>>(
    (params, event) => {
      if (dragRowId === '') {
        return;
      }

      const rowNode = gridRowNodeSelector(apiRef, params.id);

      if (!rowNode || rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
        return;
      }

      logger.debug(`Dragging over row ${params.id}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      if (params.id !== dragRowId) {
        const targetRowIndex = sortedRowIndexLookup[params.id];
        const sourceRowIndex = sortedRowIndexLookup[dragRowId];

        // Determine drop position based on source and target row relationship
        // If target is before source, place border above target (row will go above target)
        // If source is before target, place border below target (row will go below target)
        const dropPosition = targetRowIndex < sourceRowIndex ? 'above' : 'below';

        // Check if this drop would result in no actual movement
        const wouldResultInNoMovement =
          (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) || // dragging to immediately below (above next row)
          (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1); // dragging to immediately above (below previous row)

        const currentReorderState: ReorderStateProps = {
          dragDirection: dropPosition === 'above' ? Direction.UP : Direction.DOWN,
          previousTargetId: params.id,
        };

        // Only update visual indicator:
        // 1. When dragging over a different row
        // 2. When it would result in actual movement
        if (previousReorderState.previousTargetId !== params.id) {
          if (wouldResultInNoMovement) {
            // Clear any existing indicators since this wouldn't result in movement
            setDropTarget({
              targetRowId: null,
              targetRowIndex: null,
              dropPosition: null,
            });
            applyDropIndicator(null, null);
          } else {
            setDropTarget({
              targetRowId: params.id,
              targetRowIndex,
              dropPosition,
            });
            applyDropIndicator(params.id, dropPosition);
          }
          previousReorderState = currentReorderState;
        }
      } else if (previousReorderState.previousTargetId !== null) {
        setDropTarget({
          targetRowId: null,
          targetRowIndex: null,
          dropPosition: null,
        });
        applyDropIndicator(null, null);
        previousReorderState = {
          previousTargetId: null,
          dragDirection: null,
        };
      }
    },
    [dragRowId, apiRef, logger, sortedRowIndexLookup, applyDropIndicator],
  );

  const handleDragEnd = React.useCallback<GridEventListener<'rowDragEnd'>>(
    (_, event): void => {
      // Call the gridEditRowsStateSelector directly to avoid infnite loop
      const editRowsState = gridEditRowsStateSelector(apiRef);
      if (dragRowId === '' || isRowReorderDisabled || Object.keys(editRowsState).length !== 0) {
        return;
      }

      logger.debug('End dragging row');
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      clearTimeout(removeDnDStylesTimeout.current);
      dragRowNode.current = null;
      previousReorderState.dragDirection = null;

      // Clear visual indicators and dragged state
      applyDropIndicator(null, null);
      applyDraggedState(dragRowId, false);

      // Check if the row was dropped outside the grid.
      if (!event.dataTransfer || event.dataTransfer.dropEffect === 'none') {
        // Reset drop target state
        setDropTarget({
          targetRowId: null,
          targetRowIndex: null,
          dropPosition: null,
        });
        originRowIndex.current = null;
      } else {
        if (dropTarget.targetRowIndex !== null && dropTarget.targetRowId !== null) {
          const sourceRowIndex = originRowIndex.current!;
          const targetRowIndex = dropTarget.targetRowIndex;
          const dropPosition = dropTarget.dropPosition;

          const isReorderInvalid =
            (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) || // dragging to immediately below (above next row)
            (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1) || // dragging to immediately above (below previous row)
            dropTarget.targetRowId === dragRowId; // dragging to the same row

          if (!isReorderInvalid) {
            applyRowAnimation(dragRowId, () => {
              apiRef.current.setRowIndex(dragRowId, targetRowIndex);

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
        setDropTarget({
          targetRowId: null,
          targetRowIndex: null,
          dropPosition: null,
        });
      }

      setDragRowId('');
    },
    [
      apiRef,
      dragRowId,
      isRowReorderDisabled,
      logger,
      dropTarget,
      applyDropIndicator,
      applyDraggedState,
      applyRowAnimation,
    ],
  );

  useGridEvent(apiRef, 'rowDragStart', handleDragStart);
  useGridEvent(apiRef, 'rowDragOver', handleDragOver);
  useGridEvent(apiRef, 'rowDragEnd', handleDragEnd);
  useGridEvent(apiRef, 'cellDragOver', handleDragOver);
  useGridEventPriority(apiRef, 'rowOrderChange', props.onRowOrderChange);
};
