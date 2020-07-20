import * as React from 'react';
import { ColDef } from '../../models/colDef';
import { ScrollParams, useLogger } from '../utils';
import { COL_RESIZE_START, COL_RESIZE_STOP, SCROLLING } from '../../constants/eventsConstants';
import { findCellElementsFromCol, findDataContainerFromCurrent } from '../../utils';
import { useStateRef } from '../utils/useStateRef';
import { ApiRef } from '../../models';

const MIN_COL_WIDTH = 50;
const MOUSE_LEFT_TIMEOUT = 1000;

// TODO improve experience for last column
export const useColumnResize = (
  columnsRef: React.RefObject<HTMLDivElement>,
  apiRef: ApiRef,
  headerHeight: number,
) => {
  const logger = useLogger('useColumnResize');

  const isResizing = React.useRef<boolean>(false);
  const isLastColumn = React.useRef<boolean>(false);
  const mouseLeftTimeout = React.useRef<any>();
  const stopResizeEventTimeout = React.useRef<any>();

  const currentColDefRef = React.useRef<ColDef>();
  const currentColElem = React.useRef<HTMLDivElement>();
  const currentColPosition = React.useRef<number>();
  const currentColPreviousWidth = React.useRef<number>();
  const currentColCellsElems = React.useRef<NodeListOf<Element>>();

  const dataContainerElemRef = React.useRef<HTMLDivElement>();
  const dataContainerPreviousWidth = React.useRef<number>();
  const scrollOffset = React.useRef<number>(0);
  const resizingMouseMove = React.useRef<{ x: number; y: number }>();

  const onScrollHandler = React.useCallback((params: ScrollParams) => {
    scrollOffset.current = params.left;
  }, []);

  React.useEffect(() => {
    if (apiRef && apiRef.current) {
      return apiRef.current.registerEvent(SCROLLING, onScrollHandler);
    }

    return undefined;
  }, [apiRef, onScrollHandler]);

  const handleMouseDown = React.useCallback(
    (col: ColDef): void => {
      if (!apiRef || !apiRef.current) {
        return;
      }
      logger.debug(`Start Resize on col ${col.field}`);
      apiRef.current.emit(COL_RESIZE_START);
      isResizing.current = true;
      currentColDefRef.current = col;
      currentColPreviousWidth.current = col.width;
      currentColElem.current = columnsRef?.current?.querySelector(
        `[data-field="${col.field}"]`,
      ) as HTMLDivElement;
      currentColCellsElems.current = findCellElementsFromCol(currentColElem.current) || undefined;
      dataContainerElemRef.current =
        findDataContainerFromCurrent(currentColElem.current) || undefined;
      dataContainerPreviousWidth.current = Number(
        dataContainerElemRef.current!.style.minWidth.replace('px', ''),
      );
      currentColPosition.current = apiRef.current.getColumnPosition(col.field);
      isLastColumn.current =
        apiRef.current.getColumnIndex(col.field) === apiRef.current.getVisibleColumns().length - 1;
    },
    [apiRef, columnsRef, logger],
  );

  const stopResize = React.useCallback((): void => {
    isResizing.current = false;
    currentColPosition.current = undefined;
    currentColElem.current = undefined;
    currentColCellsElems.current = undefined;
    resizingMouseMove.current = undefined;
    isLastColumn.current = false;
    if (currentColDefRef.current) {
      logger.debug(
        `Updating col ${currentColDefRef.current.field} with new width: ${currentColDefRef.current.width}`,
      );
      apiRef?.current?.updateColumn(currentColDefRef.current);
      currentColDefRef.current = undefined;
    }

    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current?.emit(COL_RESIZE_STOP);
    }, 200);
  }, [apiRef, logger]);

  const updateWidth = React.useCallback(
    (newWidth: number) => {
      logger.debug(`Updating width to ${newWidth} for col ${currentColDefRef.current!.field}`);
      if (currentColDefRef.current) {
        currentColDefRef.current.width = newWidth;
      }
      if (currentColElem.current) {
        currentColElem.current.style.width = `${newWidth}px`;
        currentColElem.current.style.minWidth = `${newWidth}px`;
        currentColElem.current.style.maxWidth = `${newWidth}px`;
      }
      if (dataContainerElemRef.current) {
        const diffWithPrev = newWidth - currentColPreviousWidth.current!;
        dataContainerElemRef.current.style.minWidth = `${
          dataContainerPreviousWidth.current! + diffWithPrev
        }px`;

        if (isLastColumn.current && apiRef && apiRef.current) {
          apiRef.current.scroll({ left: dataContainerPreviousWidth.current! + diffWithPrev });
        }
      }
      if (currentColCellsElems.current) {
        currentColCellsElems.current.forEach((el) => {
          const div = el as HTMLDivElement;
          div.style.width = `${newWidth}px`;
          div.style.minWidth = `${newWidth}px`;
          div.style.maxWidth = `${newWidth}px`;
        });
      }
    },
    [apiRef, logger],
  );

  const handleMouseEnter = React.useCallback((): void => {
    if (mouseLeftTimeout.current != null) {
      clearTimeout(mouseLeftTimeout.current);
    }
  }, []);
  const handleMouseLeave = React.useCallback((): void => {
    if (
      isLastColumn.current &&
      resizingMouseMove.current &&
      resizingMouseMove.current.y >= 0 &&
      resizingMouseMove.current.y <= headerHeight &&
      currentColDefRef.current
    ) {
      logger.debug(`Mouse left and same row, so extending last column width of 100`);

      // we are resizing the last column outside the window
      updateWidth(currentColDefRef.current.width! + 10);
      mouseLeftTimeout.current = setTimeout(() => {
        stopResize();
      }, MOUSE_LEFT_TIMEOUT);
    } else if (isResizing) {
      mouseLeftTimeout.current = setTimeout(() => {
        stopResize();
      }, MOUSE_LEFT_TIMEOUT);
    }
  }, [headerHeight, logger, stopResize, updateWidth]);

  const handleMouseMove = React.useCallback(
    (ev: MouseEvent): void => {
      if (isResizing.current) {
        const target = ev.currentTarget! as HTMLDivElement;
        const rect = target.getBoundingClientRect();

        resizingMouseMove.current = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };

        const offsetLeft = !isLastColumn.current ? rect.left : scrollOffset.current * -1;

        let newWidth = ev.clientX - offsetLeft - currentColPosition.current!;
        newWidth = newWidth > MIN_COL_WIDTH ? newWidth : MIN_COL_WIDTH;
        updateWidth(newWidth);
      }
    },
    [updateWidth],
  );

  // This a hack due to the limitation of react as I cannot put columnsRef in the dependency array of the effect adding the Event listener
  const columnsRefState = useStateRef(columnsRef);

  React.useEffect(() => {
    if (columnsRef && columnsRef.current) {
      logger.info('Adding resizing event listener');
      const columnsRefEvents = columnsRef.current;
      columnsRef.current.addEventListener('mouseup', stopResize);
      columnsRef.current.addEventListener('mouseleave', handleMouseLeave);
      columnsRef.current.addEventListener('mouseenter', handleMouseEnter);
      columnsRef.current.addEventListener('mousemove', handleMouseMove);

      return () => {
        columnsRefEvents.removeEventListener('mouseup', stopResize);
        columnsRefEvents.removeEventListener('mouseleave', handleMouseLeave);
        columnsRefEvents.removeEventListener('mouseenter', handleMouseEnter);
        columnsRefEvents.removeEventListener('mousemove', handleMouseMove);
      };
    }
    return undefined;
  }, [
    columnsRefState,
    columnsRef,
    handleMouseLeave,
    handleMouseDown,
    handleMouseMove,
    handleMouseEnter,
    logger,
    stopResize,
  ]);

  React.useEffect(() => {
    return () => {
      clearTimeout(mouseLeftTimeout.current);
      clearTimeout(stopResizeEventTimeout.current);
    };
  }, []);

  return handleMouseDown;
};
