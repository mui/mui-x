import { RefObject, useCallback, useEffect, useRef } from 'react';
import { ColDef } from '../../models/colDef';
import { ScrollParams, useLogger } from '../utils';
import { COL_RESIZE_START, COL_RESIZE_STOP, SCROLLING } from '../../constants/eventsConstants';
import { findCellElementsFromCol, findDataContainerFromCurrent } from '../../utils';
import { GridApiRef } from '../../grid';
import { useStateRef } from '../utils/useStateRef';

const MIN_COL_WIDTH = 30;
const MOUSE_LEFT_TIMEOUT = 1000;

//TODO improve experience for last column
export const useColumnResize = (
  columnsRef: React.RefObject<HTMLDivElement>,
  apiRef: GridApiRef,
  headerHeight: number,
) => {
  const logger = useLogger('useColumnResize');

  const isResizing = useRef<boolean>(false);
  const isLastColumn = useRef<boolean>(false);
  const mouseLeftTimeout = useRef<any>();
  const stopResizeEventTimeout = useRef<any>();

  const currentColDefRef = useRef<ColDef>();
  const currentColElem = useRef<HTMLDivElement>();
  const currentColPosition = useRef<number>();
  const currentColPreviousWidth = useRef<number>();
  const currentColCellsElems = useRef<NodeListOf<Element>>();

  const dataContainerElemRef = useRef<HTMLDivElement>();
  const dataContainerPreviousWidth = useRef<number>();
  const scrollOffset = useRef<number>(0);
  const resizingMouseMove = useRef<{ x: number; y: number }>();

  const onScrollHandler = useCallback(
    (params: ScrollParams) => {
      scrollOffset.current = params.left;
    },
    [apiRef],
  );

  useEffect(() => {
    if (apiRef && apiRef.current) {
      return apiRef.current.registerEvent(SCROLLING, onScrollHandler);
    }
  }, [apiRef]);

  const handleMouseDown = useCallback((col: ColDef): void => {
    if (!apiRef || !apiRef.current) {
      return;
    }
    logger.debug(`Start Resize on col ${col.field}`);
    apiRef.current.emit(COL_RESIZE_START);
    isResizing.current = true;
    currentColDefRef.current = col;
    currentColPreviousWidth.current = col.width;
    currentColElem.current = columnsRef?.current?.querySelector(`[data-field="${col.field}"]`) as HTMLDivElement;
    currentColCellsElems.current = findCellElementsFromCol(currentColElem.current) || undefined;
    dataContainerElemRef.current = findDataContainerFromCurrent(currentColElem.current) || undefined;
    dataContainerPreviousWidth.current = Number(dataContainerElemRef.current!.style.minWidth.replace('px', ''));
    currentColPosition.current = apiRef.current.getColumnPosition(col.field);
    isLastColumn.current = apiRef.current.getColumnIndex(col.field) === apiRef.current.getVisibleColumns().length - 1;
  }, []);

  const stopResize = useCallback((): void => {
    logger.debug(`Stopping Resize for col ${currentColDefRef.current?.field}`);
    isResizing.current = false;

    // setColResizing(undefined);
    currentColPosition.current = undefined;
    currentColElem.current = undefined;
    currentColCellsElems.current = undefined;
    resizingMouseMove.current = undefined;
    isLastColumn.current = false;
    if (currentColDefRef.current) {
      logger.debug(`Updating col ${currentColDefRef.current.field} with new width: ${currentColDefRef.current.width}`);
      apiRef?.current?.updateColumn(currentColDefRef.current);
      currentColDefRef.current = undefined;
    }

    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current?.emit(COL_RESIZE_STOP);
    }, 200);
  }, []);

  const updateWidth = useCallback((newWidth: number) => {
    logger.debug(`Updating width to ${newWidth} for col ${currentColDefRef.current!.field}`);
    if (currentColDefRef.current) {
      currentColDefRef.current.width = newWidth;
    }
    if (currentColElem.current) {
      currentColElem.current.style.width = newWidth + 'px';
      currentColElem.current.style.minWidth = newWidth + 'px';
      currentColElem.current.style.maxWidth = newWidth + 'px';
    }
    if (dataContainerElemRef.current) {
      const diffWithPrev = newWidth - currentColPreviousWidth.current!;
      dataContainerElemRef.current.style.minWidth = dataContainerPreviousWidth.current! + diffWithPrev + 'px';

      if (isLastColumn.current && apiRef && apiRef.current) {
        apiRef.current.scroll({ left: dataContainerPreviousWidth.current! + diffWithPrev });
      }
    }
    if (currentColCellsElems.current) {
      currentColCellsElems.current.forEach(el => {
        const div = el as HTMLDivElement;
        div.style.width = newWidth + 'px';
        div.style.minWidth = newWidth + 'px';
        div.style.maxWidth = newWidth + 'px';
      });
    }
  }, []);

  const handleMouseEnter = useCallback((): void => {
    if (mouseLeftTimeout.current != null) {
      clearTimeout(mouseLeftTimeout.current);
    }
  }, []);
  const handleMouseLeave = useCallback((): void => {
    if (
      isLastColumn.current &&
      resizingMouseMove.current &&
      resizingMouseMove.current.y >= 0 &&
      resizingMouseMove.current.y <= headerHeight &&
      currentColDefRef.current
    ) {
      logger.debug(`Mouse left and same row, so extending last column width of 100`);

      //we are resizing the last column outside the window
      updateWidth(currentColDefRef.current.width! + 100);
      mouseLeftTimeout.current = setTimeout(() => {
        stopResize();
      }, MOUSE_LEFT_TIMEOUT);

      return;
    } else if (isResizing) {
      stopResize();
    }
  }, []);

  const handleMouseMove = useCallback((ev: any): void => {
    if (isResizing.current) {
      resizingMouseMove.current = { x: ev.clientX, y: ev.clientY };

      let newWidth = ev.clientX + scrollOffset.current - currentColPosition.current!;
      newWidth = newWidth > MIN_COL_WIDTH ? newWidth : MIN_COL_WIDTH;
      updateWidth(newWidth);
    }
  }, []);

  //This a hack due to the limitation of react as I cannot put columnsRef in the dependency array of the effect adding the Event listener
  const columnsRefState = useStateRef(columnsRef);
  useEffect(() => {
    if (columnsRef && columnsRef.current) {
      logger.info('Adding resizing event listener');
      columnsRef.current.addEventListener('mouseup', stopResize);
      columnsRef.current.addEventListener('mouseleave', handleMouseLeave);
      columnsRef.current.addEventListener('mouseenter', handleMouseEnter);
      columnsRef.current.addEventListener('mousemove', handleMouseMove);

      return () => {
        columnsRef.current?.removeEventListener('mouseup', stopResize);
        columnsRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        columnsRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        columnsRef.current?.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [columnsRefState]);

  useEffect(() => {
    return () => {
      clearTimeout(mouseLeftTimeout.current);
      clearTimeout(stopResizeEventTimeout.current);
    };
  }, []);

  return handleMouseDown;
};
