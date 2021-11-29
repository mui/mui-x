import * as React from 'react';
import { ownerDocument, useEventCallback } from '@mui/material/utils';
import { GridStateColDef } from '../../../models/colDef';
import { useGridLogger } from '../../utils';
import { GridEvents, GridEventListener } from '../../../models/events';
import { gridClasses } from '../../../gridClasses';
import {
  findGridCellElementsFromCol,
  findParentElementFromClassName,
  getFieldFromHeaderElem,
  findHeaderElementFromField,
} from '../../../utils/domUtils';
import { GridApiRef, CursorCoordinates, GridColumnResizeParams } from '../../../models';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { useGridState } from '../../utils/useGridState';
import { useGridNativeEventListener } from '../../utils/useGridNativeEventListener';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridStateInit } from '../../utils/useGridStateInit';

// TODO: remove support for Safari < 13.
// https://caniuse.com/#search=touch-action
//
// Safari, on iOS, supports touch action since v13.
// Over 80% of the iOS phones are compatible
// in August 2020.
// Utilizing the CSS.supports method to check if touch-action is supported.
// Since CSS.supports is supported on all but Edge@12 and IE and touch-action
// is supported on both Edge@12 and IE if CSS.supports is not available that means that
// touch-action will be supported
let cachedSupportsTouchActionNone = false;
function doesSupportTouchActionNone(): boolean {
  if (cachedSupportsTouchActionNone === undefined) {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      cachedSupportsTouchActionNone = CSS.supports('touch-action', 'none');
    } else {
      cachedSupportsTouchActionNone = true;
    }
  }
  return cachedSupportsTouchActionNone;
}

function trackFinger(event, currentTouchId): CursorCoordinates | boolean {
  if (currentTouchId !== undefined && event.changedTouches) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === currentTouchId) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }

    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

/**
 * Only available in DataGridPro
 * @requires useGridColumns (method, event)
 * TODO: improve experience for last column
 */
export const useGridColumnResize = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'onColumnResize' | 'onColumnWidthChange'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridColumnResize');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    columnResize: { resizingColumnField: '' },
  }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const colDefRef = React.useRef<GridStateColDef>();
  const colElementRef = React.useRef<HTMLDivElement>();
  const colCellElementsRef = React.useRef<NodeListOf<Element>>();
  const initialOffset = React.useRef<number>();
  const stopResizeEventTimeout = React.useRef<any>();
  const touchId = React.useRef<number>();

  const updateWidth = (newWidth: number) => {
    logger.debug(`Updating width to ${newWidth} for col ${colDefRef.current!.field}`);

    colDefRef.current!.computedWidth = newWidth;
    colDefRef.current!.width = newWidth;
    colDefRef.current!.flex = undefined;

    colElementRef.current!.style.width = `${newWidth}px`;
    colElementRef.current!.style.minWidth = `${newWidth}px`;
    colElementRef.current!.style.maxWidth = `${newWidth}px`;

    colCellElementsRef.current!.forEach((element) => {
      const div = element as HTMLDivElement;
      div.style.width = `${newWidth}px`;
      div.style.minWidth = `${newWidth}px`;
      div.style.maxWidth = `${newWidth}px`;
    });
  };

  const handleResizeMouseUp = useEventCallback((nativeEvent: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();

    apiRef.current.updateColumn(colDefRef.current!);

    clearTimeout(stopResizeEventTimeout.current);
    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current.publishEvent(GridEvents.columnResizeStop, null, nativeEvent);
      if (colDefRef.current) {
        apiRef.current.publishEvent(
          GridEvents.columnWidthChange,
          {
            element: colElementRef.current,
            colDef: colDefRef.current,
            width: colDefRef.current?.computedWidth,
          },
          nativeEvent,
        );
      }
    });

    logger.debug(
      `Updating col ${colDefRef.current!.field} with new width: ${colDefRef.current!.width}`,
    );
  });

  const handleResizeMouseMove = useEventCallback((nativeEvent: MouseEvent) => {
    // Cancel move in case some other element consumed a mouseup event and it was not fired.
    if (nativeEvent.buttons === 0) {
      handleResizeMouseUp(nativeEvent);
      return;
    }

    let newWidth =
      initialOffset.current! +
      nativeEvent.clientX -
      colElementRef.current!.getBoundingClientRect().left;
    newWidth = Math.max(colDefRef.current?.minWidth!, newWidth);

    updateWidth(newWidth);
    const params: GridColumnResizeParams = {
      element: colElementRef.current,
      colDef: colDefRef.current!,
      width: newWidth,
    };
    apiRef.current.publishEvent(GridEvents.columnResize, params, nativeEvent);
  });

  const handleColumnResizeMouseDown: GridEventListener<GridEvents.columnSeparatorMouseDown> =
    useEventCallback(({ colDef }, event) => {
      // Only handle left clicks
      if (event.button !== 0) {
        return;
      }

      // Skip if the column isn't resizable
      if (!event.currentTarget.classList.contains(gridClasses['columnSeparator--resizable'])) {
        return;
      }

      // Avoid text selection
      event.preventDefault();

      logger.debug(`Start Resize on col ${colDef.field}`);
      apiRef.current.publishEvent(GridEvents.columnResizeStart, { field: colDef.field }, event);

      colDefRef.current = colDef;
      colElementRef.current =
        apiRef.current.columnHeadersContainerElementRef?.current!.querySelector(
          `[data-field="${colDef.field}"]`,
        ) as HTMLDivElement;

      colCellElementsRef.current = findGridCellElementsFromCol(
        colElementRef.current,
      ) as NodeListOf<Element>;

      const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
      doc.body.style.cursor = 'col-resize';

      initialOffset.current =
        colDefRef.current!.computedWidth -
        (event.clientX - colElementRef.current!.getBoundingClientRect().left);

      doc.addEventListener('mousemove', handleResizeMouseMove);
      doc.addEventListener('mouseup', handleResizeMouseUp);
    });

  const handleTouchEnd = useEventCallback((nativeEvent: any) => {
    const finger = trackFinger(nativeEvent, touchId.current);

    if (!finger) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();

    apiRef.current.updateColumn(colDefRef.current!);

    clearTimeout(stopResizeEventTimeout.current);
    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current.publishEvent(GridEvents.columnResizeStop, null, nativeEvent);
    });

    logger.debug(
      `Updating col ${colDefRef.current!.field} with new width: ${colDefRef.current!.width}`,
    );
  });

  const handleTouchMove = useEventCallback((nativeEvent: any) => {
    const finger = trackFinger(nativeEvent, touchId.current);
    if (!finger) {
      return;
    }

    // Cancel move in case some other element consumed a touchmove event and it was not fired.
    if (nativeEvent.type === 'mousemove' && nativeEvent.buttons === 0) {
      handleTouchEnd(nativeEvent);
      return;
    }

    let newWidth =
      initialOffset.current! +
      (finger as CursorCoordinates).x -
      colElementRef.current!.getBoundingClientRect().left;
    newWidth = Math.max(colDefRef.current?.minWidth!, newWidth);

    updateWidth(newWidth);
    const params: GridColumnResizeParams = {
      element: colElementRef.current,
      colDef: colDefRef.current!,
      width: newWidth,
    };
    apiRef.current.publishEvent(GridEvents.columnResize, params, nativeEvent);
  });

  const handleTouchStart = useEventCallback((event: any) => {
    const cellSeparator = findParentElementFromClassName(
      event.target,
      gridClasses['columnSeparator--resizable'],
    );
    // Let the event bubble if the target is not a col separator
    if (!cellSeparator) {
      return;
    }
    // If touch-action: none; is not supported we need to prevent the scroll manually.
    if (!doesSupportTouchActionNone()) {
      event.preventDefault();
    }

    const touch = event.changedTouches[0];
    if (touch != null) {
      // A number that uniquely identifies the current finger in the touch session.
      touchId.current = touch.identifier;
    }

    colElementRef.current = findParentElementFromClassName(
      event.target,
      gridClasses.columnHeader,
    ) as HTMLDivElement;
    const field = getFieldFromHeaderElem(colElementRef.current!);
    const colDef = apiRef.current.getColumn(field);

    logger.debug(`Start Resize on col ${colDef.field}`);
    apiRef.current.publishEvent(GridEvents.columnResizeStart, { field }, event);

    colDefRef.current = colDef;
    colElementRef.current = findHeaderElementFromField(
      apiRef.current.columnHeadersElementRef?.current!,
      colDef.field,
    ) as HTMLDivElement;
    colCellElementsRef.current = findGridCellElementsFromCol(
      colElementRef.current,
    ) as NodeListOf<Element>;

    initialOffset.current =
      colDefRef.current!.computedWidth -
      (touch.clientX - colElementRef.current!.getBoundingClientRect().left);

    const doc = ownerDocument(event.currentTarget as HTMLElement);
    doc.addEventListener('touchmove', handleTouchMove);
    doc.addEventListener('touchend', handleTouchEnd);
  });

  const stopListening = React.useCallback(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
    doc.body.style.removeProperty('cursor');
    doc.removeEventListener('mousemove', handleResizeMouseMove);
    doc.removeEventListener('mouseup', handleResizeMouseUp);
    doc.removeEventListener('touchmove', handleTouchMove);
    doc.removeEventListener('touchend', handleTouchEnd);
  }, [apiRef, handleResizeMouseMove, handleResizeMouseUp, handleTouchMove, handleTouchEnd]);

  const handleResizeStart = React.useCallback<GridEventListener<GridEvents.columnResizeStart>>(
    ({ field }) => {
      setGridState((state) => ({
        ...state,
        columnResize: { ...state.columnResize, resizingColumnField: field },
      }));
      forceUpdate();
    },
    [setGridState, forceUpdate],
  );

  const handleResizeStop = React.useCallback<GridEventListener<GridEvents.columnResizeStop>>(() => {
    setGridState((state) => ({
      ...state,
      columnResize: { ...state.columnResize, resizingColumnField: '' },
    }));
    forceUpdate();
  }, [setGridState, forceUpdate]);

  React.useEffect(() => {
    return () => {
      clearTimeout(stopResizeEventTimeout.current);
      stopListening();
    };
  }, [apiRef, handleTouchStart, stopListening]);

  useGridNativeEventListener(
    apiRef,
    () => apiRef.current.columnHeadersElementRef?.current,
    'touchstart',
    handleTouchStart,
    { passive: doesSupportTouchActionNone() },
  );

  useGridApiEventHandler(apiRef, GridEvents.columnSeparatorMouseDown, handleColumnResizeMouseDown);
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, handleResizeStart);
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStop, handleResizeStop);

  useGridApiOptionHandler(apiRef, GridEvents.columnResize, props.onColumnResize);
  useGridApiOptionHandler(apiRef, GridEvents.columnWidthChange, props.onColumnWidthChange);
};
