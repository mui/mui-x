import * as React from 'react';
import { ownerDocument, useEventCallback } from '@mui/material/utils';
import {
  GridEventListener,
  gridClasses,
  CursorCoordinates,
  GridColumnHeaderSeparatorSides,
  GridColumnResizeParams,
  GridColumnHeaderSeparatorProps,
  useGridApiEventHandler,
  useGridApiOptionHandler,
  useGridNativeEventListener,
  useGridLogger,
  GridStateColDef,
} from '@mui/x-data-grid';
import {
  clamp,
  findParentElementFromClassName,
  GridStateInitializer,
} from '@mui/x-data-grid/internals';
import {
  findGridCellElementsFromCol,
  getFieldFromHeaderElem,
  findHeaderElementFromField,
} from '../../../utils/domUtils';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

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

function trackFinger(event: any, currentTouchId: number | undefined): CursorCoordinates | boolean {
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

function computeNewWidth(
  initialOffsetToSeparator: number,
  clickX: number,
  columnBounds: DOMRect,
  separatorSide: GridColumnHeaderSeparatorProps['side'],
) {
  let newWidth = initialOffsetToSeparator;
  if (separatorSide === GridColumnHeaderSeparatorSides.Right) {
    newWidth += clickX - columnBounds.left;
  } else {
    newWidth += columnBounds.right - clickX;
  }
  return newWidth;
}

function computeOffsetToSeparator(
  clickX: number,
  columnBounds: DOMRect,
  separatorSide: GridColumnHeaderSeparatorProps['side'],
) {
  if (separatorSide === GridColumnHeaderSeparatorSides.Left) {
    return clickX - columnBounds.left;
  }
  return columnBounds.right - clickX;
}

function getSeparatorSide(element: HTMLElement) {
  return element.classList.contains(gridClasses['columnSeparator--sideRight'])
    ? GridColumnHeaderSeparatorSides.Right
    : GridColumnHeaderSeparatorSides.Left;
}

export const columnResizeStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  columnResize: { resizingColumnField: '' },
});

/**
 * @requires useGridColumns (method, event)
 * TODO: improve experience for last column
 */
export const useGridColumnResize = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'onColumnResize' | 'onColumnWidthChange'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridColumnResize');

  const colDefRef = React.useRef<GridStateColDef>();
  const colElementRef = React.useRef<HTMLDivElement>();
  const colCellElementsRef = React.useRef<Element[]>();

  // To improve accessibility, the separator has padding on both sides.
  // Clicking inside the padding area should be treated as a click in the separator.
  // This ref stores the offset between the click and the separator.
  const initialOffsetToSeparator = React.useRef<number>();
  const separatorSide = React.useRef<GridColumnHeaderSeparatorProps['side']>();

  const stopResizeEventTimeout = React.useRef<any>();
  const touchId = React.useRef<number>();

  const updateWidth = (newWidth: number) => {
    logger.debug(`Updating width to ${newWidth} for col ${colDefRef.current!.field}`);

    const prevWidth = colElementRef.current!.offsetWidth;
    const widthDiff = newWidth - prevWidth;

    colDefRef.current!.computedWidth = newWidth;
    colDefRef.current!.width = newWidth;
    colDefRef.current!.flex = 0;

    colElementRef.current!.style.width = `${newWidth}px`;
    colElementRef.current!.style.minWidth = `${newWidth}px`;
    colElementRef.current!.style.maxWidth = `${newWidth}px`;

    colCellElementsRef.current!.forEach((element) => {
      const div = element as HTMLDivElement;
      let finalWidth: `${number}px`;

      if (div.getAttribute('aria-colspan') === '1') {
        finalWidth = `${newWidth}px`;
      } else {
        // Cell with colspan > 1 cannot be just updated width new width.
        // Instead, we add width diff to the current width.
        finalWidth = `${div.offsetWidth + widthDiff}px`;
      }

      div.style.width = finalWidth;
      div.style.minWidth = finalWidth;
      div.style.maxWidth = finalWidth;
    });
  };

  const handleResizeMouseUp = useEventCallback((nativeEvent: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();

    apiRef.current.updateColumn(colDefRef.current!);

    clearTimeout(stopResizeEventTimeout.current);
    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current.publishEvent('columnResizeStop', null, nativeEvent);
      if (colDefRef.current) {
        apiRef.current.publishEvent(
          'columnWidthChange',
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

    let newWidth = computeNewWidth(
      initialOffsetToSeparator.current!,
      nativeEvent.clientX,
      colElementRef.current!.getBoundingClientRect(),
      separatorSide.current!,
    );

    newWidth = clamp(newWidth, colDefRef.current!.minWidth!, colDefRef.current!.maxWidth!);
    updateWidth(newWidth);

    const params: GridColumnResizeParams = {
      element: colElementRef.current,
      colDef: colDefRef.current!,
      width: newWidth,
    };
    apiRef.current.publishEvent('columnResize', params, nativeEvent);
  });

  const handleColumnResizeMouseDown: GridEventListener<'columnSeparatorMouseDown'> =
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
      apiRef.current.publishEvent('columnResizeStart', { field: colDef.field }, event);

      colDefRef.current = colDef as GridStateColDef;
      colElementRef.current =
        apiRef.current.columnHeadersContainerElementRef?.current!.querySelector<HTMLDivElement>(
          `[data-field="${colDef.field}"]`,
        )!;

      colCellElementsRef.current = findGridCellElementsFromCol(
        colElementRef.current,
        apiRef.current,
      );

      const doc = ownerDocument(apiRef.current.rootElementRef!.current);
      doc.body.style.cursor = 'col-resize';

      separatorSide.current = getSeparatorSide(event.currentTarget);

      initialOffsetToSeparator.current = computeOffsetToSeparator(
        event.clientX,
        colElementRef.current!.getBoundingClientRect(),
        separatorSide.current,
      );

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
      apiRef.current.publishEvent('columnResizeStop', null, nativeEvent);
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

    let newWidth = computeNewWidth(
      initialOffsetToSeparator.current!,
      (finger as CursorCoordinates).x,
      colElementRef.current!.getBoundingClientRect(),
      separatorSide.current!,
    );

    newWidth = clamp(newWidth, colDefRef.current!.minWidth!, colDefRef.current!.maxWidth!);
    updateWidth(newWidth);

    const params: GridColumnResizeParams = {
      element: colElementRef.current,
      colDef: colDefRef.current!,
      width: newWidth,
    };
    apiRef.current.publishEvent('columnResize', params, nativeEvent);
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
    apiRef.current.publishEvent('columnResizeStart', { field }, event);

    colDefRef.current = colDef as GridStateColDef;
    colElementRef.current = findHeaderElementFromField(
      apiRef.current.columnHeadersElementRef?.current!,
      colDef.field,
    ) as HTMLDivElement;
    colCellElementsRef.current = findGridCellElementsFromCol(colElementRef.current, apiRef.current);

    separatorSide.current = getSeparatorSide(event.target);

    initialOffsetToSeparator.current = computeOffsetToSeparator(
      touch.clientX,
      colElementRef.current!.getBoundingClientRect(),
      separatorSide.current!,
    );

    const doc = ownerDocument(event.currentTarget as HTMLElement);
    doc.addEventListener('touchmove', handleTouchMove);
    doc.addEventListener('touchend', handleTouchEnd);
  });

  const stopListening = React.useCallback(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef!.current);
    doc.body.style.removeProperty('cursor');
    doc.removeEventListener('mousemove', handleResizeMouseMove);
    doc.removeEventListener('mouseup', handleResizeMouseUp);
    doc.removeEventListener('touchmove', handleTouchMove);
    doc.removeEventListener('touchend', handleTouchEnd);
  }, [apiRef, handleResizeMouseMove, handleResizeMouseUp, handleTouchMove, handleTouchEnd]);

  const handleResizeStart = React.useCallback<GridEventListener<'columnResizeStart'>>(
    ({ field }) => {
      apiRef.current.setState((state) => ({
        ...state,
        columnResize: { ...state.columnResize, resizingColumnField: field },
      }));
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const handleResizeStop = React.useCallback<GridEventListener<'columnResizeStop'>>(() => {
    apiRef.current.setState((state) => ({
      ...state,
      columnResize: { ...state.columnResize, resizingColumnField: '' },
    }));
    apiRef.current.forceUpdate();
  }, [apiRef]);

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

  useGridApiEventHandler(apiRef, 'columnSeparatorMouseDown', handleColumnResizeMouseDown);
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleResizeStop);

  useGridApiOptionHandler(apiRef, 'columnResize', props.onColumnResize);
  useGridApiOptionHandler(apiRef, 'columnWidthChange', props.onColumnWidthChange);
};
