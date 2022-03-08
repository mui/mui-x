import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import {
  useGridLogger,
  unstable_useGridStateInit as useGridStateInit,
  GridEvents,
  useGridApiEventHandler,
  GridEventListener,
  getDataGridUtilityClass,
  useGridSelector,
  CursorCoordinates,
  gridSortModelSelector,
} from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { gridRowReorderDragRowSelector } from './rowReorderSelector';

const CURSOR_MOVE_DIRECTION_TOP = 'top';
const CURSOR_MOVE_DIRECTION_BOTTOM = 'bottom';

const getCursorMoveDirectionY = (
  currentCoordinates: CursorCoordinates,
  nextCoordinates: CursorCoordinates,
) => {
  return currentCoordinates.y <= nextCoordinates.y
    ? CURSOR_MOVE_DIRECTION_BOTTOM
    : CURSOR_MOVE_DIRECTION_TOP;
};

const hasCursorPositionChanged = (
  currentCoordinates: CursorCoordinates,
  nextCoordinates: CursorCoordinates,
): boolean =>
  currentCoordinates.x !== nextCoordinates.x || currentCoordinates.y !== nextCoordinates.y;

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    rowDragging: ['row--dragging'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

/**
 * Only available in DataGridPro
 * @requires useGridRows (method)
 */
export const useGridRowReorder = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'disableRowReorder' | 'classes'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRowReorder');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    rowReorder: { dragRow: '' },
  }));

  const dragRowId = useGridSelector(apiRef, gridRowReorderDragRowSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const dragRowNode = React.useRef<HTMLElement | null>(null);
  const originRowIndex = React.useRef<number | null>(null);
  const removeDnDStylesTimeout = React.useRef<any>();
  const cursorPosition = React.useRef<CursorCoordinates>({
    x: 0,
    y: 0,
  });
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);

  const handleDragStart = React.useCallback<GridEventListener<GridEvents.rowDragStart>>(
    (params, event) => {
      // TODO: remove sortModel check once row reorder is sorting compatible
      if (props.disableRowReorder || sortModel.length) {
        return;
      }

      logger.debug(`Start dragging row ${params.id}`);
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      dragRowNode.current = event.currentTarget;
      dragRowNode.current.classList.add(classes.rowDragging);

      apiRef.current.setState((state) => ({
        ...state,
        rowReorder: { ...state.rowReorder, dragRow: params.id },
      }));
      apiRef.current.forceUpdate();

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragRowNode.current!.classList.remove(classes.rowDragging);
      });

      originRowIndex.current = apiRef.current.getRowIndex(params.id);
    },
    [props.disableRowReorder, classes.rowDragging, logger, apiRef, sortModel],
  );

  const handleDragEnter = React.useCallback<GridEventListener<GridEvents.rowDragEnter>>(
    (params, event) => {
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();
    },
    [],
  );

  const handleDragOver = React.useCallback<GridEventListener<GridEvents.rowDragOver>>(
    (params, event) => {
      if (!dragRowId) {
        return;
      }

      logger.debug(`Dragging over rpw ${params.id}`);
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      const coordinates = { x: event.clientX, y: event.clientY };

      if (
        params.id !== dragRowId &&
        hasCursorPositionChanged(cursorPosition.current, coordinates)
      ) {
        const targetRowIndex = apiRef.current.getRowIndex(params.id);
        const dragRowIndex = apiRef.current.getRowIndex(dragRowId);

        const cursorMoveDirectionY = getCursorMoveDirectionY(cursorPosition.current, coordinates);
        const hasMovedTop =
          cursorMoveDirectionY === CURSOR_MOVE_DIRECTION_TOP && dragRowIndex > targetRowIndex;
        const hasMovedBottom =
          cursorMoveDirectionY === CURSOR_MOVE_DIRECTION_BOTTOM && dragRowIndex < targetRowIndex;

        if (hasMovedTop || hasMovedBottom) {
          apiRef.current.setRowIndex(dragRowId, targetRowIndex);
        }

        cursorPosition.current = coordinates;
      }
    },
    [apiRef, dragRowId, logger],
  );

  const handleDragEnd = React.useCallback<GridEventListener<GridEvents.rowDragEnd>>(
    (params, event): void => {
      // TODO: remove sortModel check once row reorder is sorting compatible
      if (props.disableRowReorder || !dragRowId || sortModel.length) {
        return;
      }

      logger.debug('End dragging row');
      event.preventDefault();
      // Prevent drag events propagation.
      // For more information check here https://github.com/mui/mui-x/issues/2680.
      event.stopPropagation();

      clearTimeout(removeDnDStylesTimeout.current);
      dragRowNode.current = null;

      // Check if the row was dropped outside the grid.
      if (event.dataTransfer.dropEffect === 'none') {
        // Accessing params.field may contain the wrong field as header elements are reused
        apiRef.current.setRowIndex(dragRowId, originRowIndex.current!);
        originRowIndex.current = null;
      }

      apiRef.current.setState((state) => ({
        ...state,
        rowReorder: { ...state.rowReorder, dragRow: '' },
      }));
      apiRef.current.forceUpdate();
    },
    [props.disableRowReorder, logger, apiRef, dragRowId, sortModel],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowDragStart, handleDragStart);
  useGridApiEventHandler(apiRef, GridEvents.rowDragEnter, handleDragEnter);
  useGridApiEventHandler(apiRef, GridEvents.rowDragOver, handleDragOver);
  useGridApiEventHandler(apiRef, GridEvents.rowDragEnd, handleDragEnd);
};
