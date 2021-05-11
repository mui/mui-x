import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GRID_COLUMN_HEADER_DRAG_START,
  GRID_COLUMN_HEADER_DRAG_OVER,
  GRID_COLUMN_HEADER_DRAG_ENTER,
  GRID_COLUMN_HEADER_DRAG_END,
  GRID_CELL_DRAG_ENTER,
  GRID_CELL_DRAG_OVER,
  GRID_CELL_DRAG_END,
} from '../../../constants/eventsConstants';
import { GRID_HEADER_CELL_DRAGGING_CSS_CLASS } from '../../../constants/cssClassesConstants';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { CursorCoordinates } from '../../../models/cursorCoordinates';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridColumnReorderDragColSelector } from './columnReorderSelector';

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

const hasCursorPositionChanged = (
  currentCoordinates: CursorCoordinates,
  nextCoordinates: CursorCoordinates,
): boolean =>
  currentCoordinates.x !== nextCoordinates.x || currentCoordinates.y !== nextCoordinates.y;

export const useGridColumnReorder = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridColumnReorder');

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const dragCol = useGridSelector(apiRef, gridColumnReorderDragColSelector);
  const dragColNode = React.useRef<HTMLElement | null>(null);
  const cursorPosition = React.useRef<CursorCoordinates>({
    x: 0,
    y: 0,
  });
  const originColumnIndex = React.useRef<number | null>(null);
  const removeDnDStylesTimeout = React.useRef<any>();

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  const handleColumnHeaderDragStart = React.useCallback(
    (params: GridColumnHeaderParams, event: React.MouseEvent<HTMLElement>) => {
      logger.debug(`Start dragging col ${params.field}`);

      dragColNode.current = event.currentTarget;
      dragColNode.current.classList.add(GRID_HEADER_CELL_DRAGGING_CSS_CLASS);

      setGridState((oldState) => ({
        ...oldState,
        columnReorder: { ...oldState.columnReorder, dragCol: params.field },
      }));
      forceUpdate();

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragColNode.current!.classList.remove(GRID_HEADER_CELL_DRAGGING_CSS_CLASS);
      });

      originColumnIndex.current = apiRef.current.getColumnIndex(params.field, false);
    },
    [forceUpdate, logger, setGridState, apiRef],
  );

  const handleDragEnter = React.useCallback(
    (params: GridColumnHeaderParams | GridCellParams, event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleDragOver = React.useCallback(
    (params: GridColumnHeaderParams | GridCellParams, event: React.DragEvent) => {
      logger.debug(`Dragging over col ${params.field}`);
      event.preventDefault();

      const coordinates = { x: event.clientX, y: event.clientY };

      if (
        params.field !== dragCol &&
        hasCursorPositionChanged(cursorPosition.current, coordinates)
      ) {
        const targetColIndex = apiRef.current.getColumnIndex(params.field, false);
        const dragColIndex = apiRef.current.getColumnIndex(dragCol, false);

        if (
          (getCursorMoveDirectionX(cursorPosition.current, coordinates) ===
            CURSOR_MOVE_DIRECTION_RIGHT &&
            dragColIndex < targetColIndex) ||
          (getCursorMoveDirectionX(cursorPosition.current, coordinates) ===
            CURSOR_MOVE_DIRECTION_LEFT &&
            targetColIndex < dragColIndex)
        ) {
          apiRef.current.setColumnIndex(dragCol, targetColIndex);
        }

        cursorPosition.current = coordinates;
      }
    },
    [apiRef, dragCol, logger],
  );

  const handleDragEnd = React.useCallback(
    (params: GridColumnHeaderParams | GridCellParams, event: React.DragEvent): void => {
      logger.debug('End dragging col');
      event.preventDefault();

      clearTimeout(removeDnDStylesTimeout.current);
      dragColNode.current = null;

      // Check if the column was dropped outside the grid.
      if (event.dataTransfer.dropEffect === 'none') {
        apiRef.current.setColumnIndex(params.field, originColumnIndex.current!);
        originColumnIndex.current = null;
      }

      setGridState((oldState) => ({
        ...oldState,
        columnReorder: { ...oldState.columnReorder, dragCol: '' },
      }));
      forceUpdate();
    },
    [logger, setGridState, forceUpdate, apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_START, handleColumnHeaderDragStart);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_ENTER, handleDragEnter);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_OVER, handleDragOver);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_END, handleDragEnd);
  useGridApiEventHandler(apiRef, GRID_CELL_DRAG_ENTER, handleDragEnter);
  useGridApiEventHandler(apiRef, GRID_CELL_DRAG_OVER, handleDragOver);
  useGridApiEventHandler(apiRef, GRID_CELL_DRAG_END, handleDragEnd);
};
