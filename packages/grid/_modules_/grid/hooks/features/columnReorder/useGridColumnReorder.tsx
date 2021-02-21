import * as React from 'react';
import { GridColDef } from '../../../models/colDef';
import { useLogger } from '../../utils/useLogger';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GRID_DRAGEND,
  GRID_COL_REORDER_START,
  GRID_COL_REORDER_DRAG_OVER,
  GRID_COL_REORDER_DRAG_OVER_HEADER,
  GRID_COL_REORDER_DRAG_ENTER,
  GRID_COL_REORDER_STOP,
} from '../../../constants/eventsConstants';
import {
  GRID_HEADER_CELL_DROP_ZONE_CSS_CLASS,
  GRID_HEADER_CELL_DRAGGING_CSS_CLASS,
} from '../../../constants/cssClassesConstants';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { ColumnReorderApi, CursorCoordinates } from '../../../models/api/columnReorderApi';
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

  const handleDragEnd = React.useCallback((): void => {
    logger.debug('End dragging col');
    apiRef.current.publishEvent(GRID_COL_REORDER_STOP);

    clearTimeout(removeDnDStylesTimeout.current);

    columnsHeaderRef.current!.classList.remove(GRID_HEADER_CELL_DROP_ZONE_CSS_CLASS);
    dragColNode.current!.removeEventListener(GRID_DRAGEND, handleDragEnd);
    dragColNode.current = null;

    setGridState((oldState) => ({
      ...oldState,
      columnReorder: { ...oldState.columnReorder, dragCol: '' },
    }));
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, logger]);

  const onColItemDragStart = React.useCallback(
    (col: GridColDef, currentTarget: HTMLElement): void => {
      logger.debug(`Start dragging col ${col.field}`);
      apiRef.current.publishEvent(GRID_COL_REORDER_START);

      dragColNode.current = currentTarget;
      dragColNode.current.addEventListener(GRID_DRAGEND, handleDragEnd, { once: true });
      dragColNode.current.classList.add(GRID_HEADER_CELL_DRAGGING_CSS_CLASS);

      setGridState((oldState) => ({
        ...oldState,
        columnReorder: { ...oldState.columnReorder, dragCol: col.field },
      }));
      forceUpdate();

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragColNode.current!.classList.remove(GRID_HEADER_CELL_DRAGGING_CSS_CLASS);
      });
    },
    [apiRef, setGridState, forceUpdate, handleDragEnd, logger],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  const onColHeaderDragOver = React.useCallback(
    (event: Event, ref: React.RefObject<HTMLElement>) => {
      event.preventDefault();
      apiRef.current.publishEvent(GRID_COL_REORDER_DRAG_OVER_HEADER);
      columnsHeaderRef.current = ref.current;
      columnsHeaderRef.current!.classList.add(GRID_HEADER_CELL_DROP_ZONE_CSS_CLASS);
    },
    [apiRef],
  );

  const onColItemDragEnter = React.useCallback(
    (event: Event) => {
      event.preventDefault();
      apiRef.current.publishEvent(GRID_COL_REORDER_DRAG_ENTER);
    },
    [apiRef],
  );

  const onColItemDragOver = React.useCallback(
    (col: GridColDef, coordinates: CursorCoordinates): void => {
      logger.debug(`Dragging over col ${col.field}`);
      apiRef.current.publishEvent(GRID_COL_REORDER_DRAG_OVER);

      if (col.field !== dragCol && hasCursorPositionChanged(cursorPosition.current, coordinates)) {
        const targetColIndex = apiRef.current.getColumnIndex(col.field, false);
        const dragColIndex = apiRef.current.getColumnIndex(dragCol, false);

        if (
          (getCursorMoveDirectionX(cursorPosition.current, coordinates) ===
            CURSOR_MOVE_DIRECTION_RIGHT &&
            dragColIndex < targetColIndex) ||
          (getCursorMoveDirectionX(cursorPosition.current, coordinates) ===
            CURSOR_MOVE_DIRECTION_LEFT &&
            targetColIndex < dragColIndex)
        ) {
          apiRef.current.moveColumn(dragCol, targetColIndex);
        }

        cursorPosition.current = coordinates;
      }
    },
    [apiRef, dragCol, logger],
  );

  const colReorderApi: ColumnReorderApi = {
    onColItemDragStart,
    onColHeaderDragOver,
    onColItemDragOver,
    onColItemDragEnter,
  };

  useGridApiMethod(apiRef, colReorderApi, 'ColReorderApi');
};
