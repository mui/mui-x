import * as React from 'react';
import { ColDef } from '../../models/colDef';
import { useLogger } from '../utils';
import { ApiRef } from '../../models';
import {
  DRAGEND,
  COL_REORDER_START,
  COL_REORDER_DRAG_OVER,
  COL_REORDER_DRAG_OVER_HEADER,
  COL_REORDER_DRAG_ENTER,
  COL_REORDER_STOP,
} from '../../constants/eventsConstants';
import {
  HEADER_CELL_DROP_ZONE_CSS_CLASS,
  HEADER_CELL_DRAGGING_CSS_CLASS,
} from '../../constants/cssClassesConstants';

export interface CursorCoordinates {
  x: number;
  y: number;
}

const CURSOR_MOVE_DIRECTION_LEFT = 'left';
const CURSOR_MOVE_DIRECTION_RIGHT = 'right';

const reorderColDefArray = (
  columns: ColDef[],
  newColIndex: number,
  oldColIndex: number,
): ColDef[] => {
  const columnsClone = columns.slice();

  columnsClone.splice(newColIndex, 0, columnsClone.splice(oldColIndex, 1)[0]);

  return columnsClone;
};

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

export const useColumnReorder = (columnsRef: React.RefObject<HTMLDivElement>, apiRef: ApiRef) => {
  const logger = useLogger('useColumnReorder');

  const dragCol = React.useRef<ColDef | null>(null);
  const dragColNode = React.useRef<HTMLElement | null>(null);
  const cursorPosition = React.useRef<CursorCoordinates>({
    x: 0,
    y: 0,
  });
  const removeDnDStylesTimeout = React.useRef<number>();

  const handleDragEnd = React.useCallback((): void => {
    logger.debug(`End dragging col ${dragCol.current!.field}`);
    apiRef.current.publishEvent(COL_REORDER_STOP);

    clearTimeout(removeDnDStylesTimeout.current);

    columnsRef.current!.classList.remove(HEADER_CELL_DROP_ZONE_CSS_CLASS);
    dragColNode.current!.parentElement!.classList.remove('MuiDataGrid-colCellMoving');
    dragColNode.current!.removeEventListener(DRAGEND, handleDragEnd);
    dragCol.current = null;
    dragColNode.current = null;
  }, [columnsRef, apiRef, logger]);

  const handleDragStart = React.useCallback(
    (col: ColDef, currentTarget: HTMLElement): void => {
      logger.debug(`Start dragging col ${col.field}`);
      apiRef.current.publishEvent(COL_REORDER_START);

      dragCol.current = col;
      dragColNode.current = currentTarget;
      dragColNode.current.addEventListener(DRAGEND, handleDragEnd, { once: true });
      dragColNode.current.classList.add(HEADER_CELL_DRAGGING_CSS_CLASS);
      dragColNode.current.parentElement!.classList.add('MuiDataGrid-colCellMoving');
      removeDnDStylesTimeout.current = setTimeout(() => {
        dragColNode.current!.classList.remove(HEADER_CELL_DRAGGING_CSS_CLASS);
      });
    },
    [apiRef, handleDragEnd, logger],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(removeDnDStylesTimeout.current);
    };
  }, []);

  const handleColumnHeaderDragOver = React.useCallback(
    (event) => {
      event.preventDefault();
      apiRef.current.publishEvent(COL_REORDER_DRAG_OVER_HEADER);

      columnsRef.current!.classList.add(HEADER_CELL_DROP_ZONE_CSS_CLASS);
    },
    [columnsRef, apiRef],
  );

  const handleDragEnter = React.useCallback(
    (event) => {
      event.preventDefault();
      apiRef.current.publishEvent(COL_REORDER_DRAG_ENTER);
    },
    [apiRef],
  );

  const handleDragOver = React.useCallback(
    (col: ColDef, coordinates: CursorCoordinates): void => {
      logger.debug(`Dragging over col ${col.field}`);
      apiRef.current.publishEvent(COL_REORDER_DRAG_OVER);

      if (
        col.field !== dragCol.current!.field &&
        hasCursorPositionChanged(cursorPosition.current, coordinates)
      ) {
        const targetColIndex = apiRef.current.getColumnIndex(col.field, false);
        const dragColIndex = apiRef.current.getColumnIndex(dragCol.current!.field, false);
        const columnsSnapshot = apiRef.current.getAllColumns();

        if (
          (getCursorMoveDirectionX(cursorPosition.current, coordinates) ===
            CURSOR_MOVE_DIRECTION_RIGHT &&
            dragColIndex < targetColIndex) ||
          (getCursorMoveDirectionX(cursorPosition.current, coordinates) ===
            CURSOR_MOVE_DIRECTION_LEFT &&
            targetColIndex < dragColIndex)
        ) {
          const columnsReordered = reorderColDefArray(
            columnsSnapshot,
            targetColIndex,
            dragColIndex,
          );
          apiRef.current.updateColumns(columnsReordered, true);
        }

        cursorPosition.current = coordinates;
      }
    },
    [apiRef, logger],
  );

  return {
    handleDragStart,
    handleColumnHeaderDragOver,
    handleDragOver,
    handleDragEnter,
  };
};
