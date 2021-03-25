import * as React from 'react';
import { useLogger } from '../../utils/useLogger';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GRID_COLUMN_REORDER_START,
  GRID_COLUMN_REORDER_DRAG_OVER,
  GRID_COLUMN_REORDER_DRAG_OVER_HEADER,
  GRID_COLUMN_REORDER_DRAG_ENTER,
  GRID_COLUMN_REORDER_DRAG_END,
} from '../../../constants/eventsConstants';
import {
  GRID_HEADER_CELL_DROP_ZONE_CSS_CLASS,
  GRID_HEADER_CELL_DRAGGING_CSS_CLASS,
} from '../../../constants/cssClassesConstants';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
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
  const columnsHeaderRef = React.useRef<HTMLElement | null>(null);
  const cursorPosition = React.useRef<CursorCoordinates>({
    x: 0,
    y: 0,
  });
  const removeDnDStylesTimeout = React.useRef<any>();

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  const handleColumnReorderStart = React.useCallback(
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
    },
    [forceUpdate, logger, setGridState],
  );

  const handleColumnReorderEnd = React.useCallback(
    (params: GridColumnHeaderParams, event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleColumnItemDragOver = React.useCallback(
    (params: GridColumnHeaderParams, event: React.MouseEvent) => {
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

  const handleHeaderDragOver = React.useCallback(
    (params: GridColumnHeaderParams, event: React.MouseEvent<HTMLElement>) => {
      columnsHeaderRef.current = event.currentTarget;
      columnsHeaderRef.current!.classList.add(GRID_HEADER_CELL_DROP_ZONE_CSS_CLASS);
    },
    [],
  );

  const handleColumnItemDragEnd = React.useCallback(
    (params: GridColumnHeaderParams, event: React.MouseEvent): void => {
      logger.debug('End dragging col');
      event.preventDefault();

      clearTimeout(removeDnDStylesTimeout.current);

      columnsHeaderRef.current!.classList.remove(GRID_HEADER_CELL_DROP_ZONE_CSS_CLASS);
      dragColNode.current = null;

      setGridState((oldState) => ({
        ...oldState,
        columnReorder: { ...oldState.columnReorder, dragCol: '' },
      }));
      forceUpdate();
    },
    [logger, setGridState, forceUpdate],
  );

  useGridApiEventHandler(apiRef, GRID_COLUMN_REORDER_START, handleColumnReorderStart);
  useGridApiEventHandler(apiRef, GRID_COLUMN_REORDER_DRAG_ENTER, handleColumnReorderEnd);
  useGridApiEventHandler(apiRef, GRID_COLUMN_REORDER_DRAG_OVER, handleColumnItemDragOver);
  useGridApiEventHandler(apiRef, GRID_COLUMN_REORDER_DRAG_OVER_HEADER, handleHeaderDragOver);
  useGridApiEventHandler(apiRef, GRID_COLUMN_REORDER_DRAG_END, handleColumnItemDragEnd);
};
