'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import composeClasses from '@mui/utils/composeClasses';
import ownerDocument from '@mui/utils/ownerDocument';
import { useRtl } from '@mui/system/RtlProvider';
import {
  useGridEvent,
  getDataGridUtilityClass,
  useGridLogger,
  useGridEventPriority,
} from '@mui/x-data-grid';
import type { CursorCoordinates, GridEventListener } from '@mui/x-data-grid';
import type { GridStateInitializer } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import { gridColumnReorderDragColSelector } from './columnReorderSelector';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { addClasses, removeClasses } from '../../../utils/classListUtils';
import {
  finishColumnReorder,
  getColumnReorderTargetIndex,
  hasCursorPositionChanged,
  setColumnReorderDragCol,
  startColumnReorder,
} from './columnReorderUtils';
import type { ColumnReorderForbiddenIndexes } from './columnReorderUtils';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

export const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    columnHeaderDragging: ['columnHeader--dragging'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const columnReorderStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  columnReorder: { dragCol: '' },
});

/**
 * @requires useGridColumns (method)
 */
export const useGridColumnReorder = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'disableColumnReorder'
    | 'keepColumnPositionIfDraggedOutside'
    | 'classes'
    | 'onColumnOrderChange'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnReorder');

  const dragColNode = React.useRef<HTMLElement | null>(null);
  const cursorPosition = React.useRef<CursorCoordinates>({
    x: 0,
    y: 0,
  });
  const originColumnIndex = React.useRef<number | null>(null);
  const forbiddenIndexes = React.useRef<ColumnReorderForbiddenIndexes>({});
  const removeDnDStylesTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);
  const isRtl = useRtl();

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  const handleDragEnd = React.useCallback<GridEventListener<'columnHeaderDragEnd'>>(
    (params, event): void => {
      const dragColField = gridColumnReorderDragColSelector(apiRef);
      if (props.disableColumnReorder || !dragColField) {
        // The reorder can get disabled while a drag is in progress. The reorder
        // state must not stay set in that case, because components like the
        // scroll areas derive their visibility from it.
        if (dragColField) {
          setColumnReorderDragCol(apiRef, '');
        }
        return;
      }

      logger.debug('End dragging col');
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      clearTimeout(removeDnDStylesTimeout.current);

      // For more information check here https://github.com/mui/mui-x/issues/14678
      removeClasses(dragColNode.current, classes.columnHeaderDragging);

      dragColNode.current = null;

      // Check if the column was dropped outside the grid.
      const restoreOrigin =
        event.dataTransfer.dropEffect === 'none' && !props.keepColumnPositionIfDraggedOutside;
      // Accessing params.field may contain the wrong field as header elements are reused
      finishColumnReorder(apiRef, {
        dragField: dragColField,
        originIndex: originColumnIndex.current!,
        restoreOrigin,
      });
      if (restoreOrigin) {
        originColumnIndex.current = null;
      }
    },
    [
      apiRef,
      props.disableColumnReorder,
      props.keepColumnPositionIfDraggedOutside,
      logger,
      classes.columnHeaderDragging,
    ],
  );

  const handleDragStart = React.useCallback<GridEventListener<'columnHeaderDragStart'>>(
    (params, event) => {
      if (props.disableColumnReorder || params.colDef.disableReorder) {
        return;
      }

      logger.debug(`Start dragging col ${params.field}`);
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      dragColNode.current = event.currentTarget;
      addClasses(dragColNode.current, classes.columnHeaderDragging);

      const handleDragEndEvent = (dragEndEvent: DragEvent) => {
        dragColNode.current!.removeEventListener('dragend', handleDragEndEvent);
        apiRef.current.publishEvent('columnHeaderDragEndNative', params, dragEndEvent);
      };
      dragColNode.current.addEventListener('dragend', handleDragEndEvent);

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
      }
      const drag = startColumnReorder(apiRef, params.field);
      originColumnIndex.current = drag.originIndex;
      forbiddenIndexes.current = drag.forbiddenIndexes;

      removeDnDStylesTimeout.current = setTimeout(() => {
        removeClasses(dragColNode.current, classes.columnHeaderDragging);
      });
    },
    [props.disableColumnReorder, classes.columnHeaderDragging, logger, apiRef],
  );

  const handleDragEnter = React.useCallback<
    GridEventListener<'cellDragEnter' | 'columnHeaderDragEnter'>
  >((params, event) => {
    event.preventDefault();
    // Prevent drag events propagation.
    // For more information check here https://github.com/mui/mui-x/issues/2680.
    event.stopPropagation();
  }, []);

  const handleDragOver = React.useCallback<
    GridEventListener<'cellDragOver' | 'columnHeaderDragOver'>
  >(
    (params, event) => {
      const dragColField = gridColumnReorderDragColSelector(apiRef);
      if (!dragColField) {
        return;
      }

      logger.debug(`Dragging over col ${params.field}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      const coordinates = { x: event.clientX, y: event.clientY };

      if (
        params.field !== dragColField &&
        hasCursorPositionChanged(cursorPosition.current, coordinates)
      ) {
        if (!apiRef.current.getColumn(params.field)) {
          return;
        }
        const targetIndex = getColumnReorderTargetIndex(apiRef, {
          dragField: dragColField,
          targetField: params.field,
          previousPosition: cursorPosition.current,
          position: coordinates,
          isRtl,
          forbiddenIndexes: forbiddenIndexes.current,
        });
        if (targetIndex !== null) {
          apiRef.current.setColumnIndex(dragColField, targetIndex);
        }

        cursorPosition.current = coordinates;
      }
    },
    [apiRef, logger, isRtl],
  );

  React.useEffect(() => {
    if (!props.keepColumnPositionIfDraggedOutside) {
      return () => {};
    }

    const doc = ownerDocument(apiRef.current.rootElementRef!.current);
    const listener = (event: DragEvent) => {
      if (event.dataTransfer) {
        // keep the drop effect if we are keeping the column position if dragged outside
        // https://github.com/mui/mui-x/issues/19183#issuecomment-3202307783
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }
    };

    doc.addEventListener('dragover', listener);
    return () => {
      doc.removeEventListener('dragover', listener);
    };
  }, [apiRef, props.keepColumnPositionIfDraggedOutside]);

  useGridEvent(apiRef, 'columnHeaderDragStart', handleDragStart);
  useGridEvent(apiRef, 'columnHeaderDragEnter', handleDragEnter);
  useGridEvent(apiRef, 'columnHeaderDragOver', handleDragOver);
  useGridEvent(apiRef, 'columnHeaderDragEndNative', handleDragEnd);
  useGridEvent(apiRef, 'cellDragEnter', handleDragEnter);
  useGridEvent(apiRef, 'cellDragOver', handleDragOver);
  useGridEventPriority(apiRef, 'columnOrderChange', props.onColumnOrderChange);
};
