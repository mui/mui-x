import * as React from 'react';
import { ColDef } from '../../../models/colDef';
import { useLogger } from '../../utils/useLogger';
import { ApiRef } from '../../../models/api/apiRef';
import {
  DRAGEND,
  COL_REORDER_START,
  COL_REORDER_DRAG_OVER,
  COL_REORDER_DRAG_OVER_HEADER,
  COL_REORDER_DRAG_ENTER,
  COL_REORDER_STOP,
} from '../../../constants/eventsConstants';
import {
  HEADER_CELL_DROP_ZONE_CSS_CLASS,
  HEADER_CELL_DRAGGING_CSS_CLASS,
} from '../../../constants/cssClassesConstants';
import { useApiMethod } from '../../root/useApiMethod';
import { ColumnReorderApi, CursorCoordinates } from '../../../models/api/columnReorderApi';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { columnReorderDragColSelector } from './columnReorderSelector';

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

export const useColumnReorder = (apiRef: ApiRef): void => {
  const logger = useLogger('useColumnReorder');

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const dragCol = useGridSelector(apiRef, columnReorderDragColSelector);
  const dragColNode = React.useRef<HTMLElement | null>(null);
  const columnsHeaderRef = React.useRef<HTMLElement | null>(null);
  const cursorPosition = React.useRef<CursorCoordinates>({
    x: 0,
    y: 0,
  });
  const removeDnDStylesTimeout = React.useRef<number>();

  const handleDragEnd = React.useCallback((): void => {
    logger.debug('End dragging col');
    apiRef.current.publishEvent(COL_REORDER_STOP);

    clearTimeout(removeDnDStylesTimeout.current);

    columnsHeaderRef.current!.classList.remove(HEADER_CELL_DROP_ZONE_CSS_CLASS);
    dragColNode.current!.removeEventListener(DRAGEND, handleDragEnd);
    dragColNode.current = null;

    setGridState((oldState) => ({
      ...oldState,
      columnReorder: { ...oldState.columnReorder, dragCol: '' },
    }));
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, logger]);

  const onColItemDragStart = React.useCallback(
    (col: ColDef, currentTarget: HTMLElement): void => {
      logger.debug(`Start dragging col ${col.field}`);
      apiRef.current.publishEvent(COL_REORDER_START);

      dragColNode.current = currentTarget;
      dragColNode.current.addEventListener(DRAGEND, handleDragEnd, { once: true });
      dragColNode.current.classList.add(HEADER_CELL_DRAGGING_CSS_CLASS);

      setGridState((oldState) => ({
        ...oldState,
        columnReorder: { ...oldState.columnReorder, dragCol: col.field },
      }));
      forceUpdate();

      removeDnDStylesTimeout.current = setTimeout(() => {
        dragColNode.current!.classList.remove(HEADER_CELL_DRAGGING_CSS_CLASS);
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
      apiRef.current.publishEvent(COL_REORDER_DRAG_OVER_HEADER);
      columnsHeaderRef.current = ref.current;
      columnsHeaderRef.current!.classList.add(HEADER_CELL_DROP_ZONE_CSS_CLASS);
    },
    [apiRef],
  );

  const onColItemDragEnter = React.useCallback(
    (event: Event) => {
      event.preventDefault();
      apiRef.current.publishEvent(COL_REORDER_DRAG_ENTER);
    },
    [apiRef],
  );

  const onColItemDragOver = React.useCallback(
    (col: ColDef, coordinates: CursorCoordinates): void => {
      logger.debug(`Dragging over col ${col.field}`);
      apiRef.current.publishEvent(COL_REORDER_DRAG_OVER);

      if (col.field !== dragCol && hasCursorPositionChanged(cursorPosition.current, coordinates)) {
        const targetColIndex = apiRef.current.getColumnIndex(col.field, false);
        const dragColIndex = apiRef.current.getColumnIndex(dragCol, false);
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
    [apiRef, dragCol, logger],
  );

  const colReorderApi: ColumnReorderApi = {
    onColItemDragStart,
    onColHeaderDragOver,
    onColItemDragOver,
    onColItemDragEnter,
  };

  useApiMethod(apiRef, colReorderApi, 'ColReorderApi');
};
