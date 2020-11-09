import * as React from 'react';
import { ownerDocument } from '@material-ui/core/utils';
import { ColDef } from '../../models/colDef';
import { useLogger } from '../utils';
import { useEventCallback } from '../../utils/material-ui-utils';
import { COL_RESIZE_START, COL_RESIZE_STOP } from '../../constants/eventsConstants';
import {
  HEADER_CELL_CSS_CLASS,
  HEADER_CELL_SEPARATOR_RESIZABLE_CSS_CLASS,
} from '../../constants/cssClassesConstants';
import {
  findCellElementsFromCol,
  findParentElementFromClassName,
  getFieldFromHeaderElem,
  findHeaderElementFromField,
} from '../../utils/domUtils';
import { ApiRef } from '../../models';
import { CursorCoordinates } from '../../models/api/columnReorderApi';

const MIN_COL_WIDTH = 50;
let cachedSupportsTouchActionNone = false;

// TODO: remove support for Safari < 13.
// https://caniuse.com/#search=touch-action
//
// Safari, on iOS, supports touch action since v13.
// Over 80% of the iOS phones are compatible
// in August 2020.
function doesSupportTouchActionNone(): boolean {
  if (!cachedSupportsTouchActionNone) {
    const element = document.createElement('div');
    element.style.touchAction = 'none';
    document.body.appendChild(element);
    cachedSupportsTouchActionNone = window.getComputedStyle(element).touchAction === 'none';
    element.parentElement!.removeChild(element);
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

// TODO improve experience for last column
export const useColumnResize = (columnsRef: React.RefObject<HTMLDivElement>, apiRef: ApiRef) => {
  const logger = useLogger('useColumnResize');
  const colDefRef = React.useRef<ColDef>();
  const colElementRef = React.useRef<HTMLDivElement>();
  const colCellElementsRef = React.useRef<NodeListOf<Element>>();
  const initialOffset = React.useRef<number>();
  const stopResizeEventTimeout = React.useRef<number>();
  const touchId = React.useRef<number>();
  const columnsHeaderElement = columnsRef.current;

  const updateWidth = (newWidth: number) => {
    logger.debug(`Updating width to ${newWidth} for col ${colDefRef.current!.field}`);

    colDefRef.current!.width = newWidth;

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

  const handleResizeMouseUp = useEventCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();

    apiRef.current!.updateColumn(colDefRef.current as ColDef);

    clearTimeout(stopResizeEventTimeout.current);
    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current.publishEvent(COL_RESIZE_STOP);
    });

    logger.debug(
      `Updating col ${colDefRef.current!.field} with new width: ${colDefRef.current!.width}`,
    );
  });

  const handleResizeMouseMove = useEventCallback((nativeEvent) => {
    // Cancel move in case some other element consumed a mouseup event and it was not fired.
    if (nativeEvent.buttons === 0) {
      handleResizeMouseUp();
      return;
    }

    let newWidth =
      initialOffset.current +
      nativeEvent.clientX -
      colElementRef.current!.getBoundingClientRect().left;
    newWidth = Math.max(MIN_COL_WIDTH, newWidth);

    updateWidth(newWidth);
  });
  const handleMouseDown = useEventCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // Only handle left clicks
    if (event.button !== 0) {
      return;
    }

    // Skip if the column isn't resizable
    if (!event.currentTarget.classList.contains('MuiDataGrid-columnSeparatorResizable')) {
      return;
    }

    // Avoid text selection
    event.preventDefault();

    colElementRef.current = findParentElementFromClassName(
      event.currentTarget,
      HEADER_CELL_CSS_CLASS,
    ) as HTMLDivElement;
    const field = colElementRef.current.getAttribute('data-field') as string;
    const colDef = apiRef.current.getColumnFromField(field);

    logger.debug(`Start Resize on col ${colDef.field}`);
    apiRef.current.publishEvent(COL_RESIZE_START, { field });

    colDefRef.current = colDef;
    colElementRef.current = columnsHeaderElement!.querySelector(
      `[data-field="${colDef.field}"]`,
    ) as HTMLDivElement;

    colCellElementsRef.current = findCellElementsFromCol(colElementRef.current) as NodeListOf<
      Element
    >;

    const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
    doc.body.style.cursor = 'col-resize';

    initialOffset.current =
      (colDefRef.current.width as number) -
      (event.clientX - colElementRef.current!.getBoundingClientRect().left);

    doc.addEventListener('mousemove', handleResizeMouseMove);
    doc.addEventListener('mouseup', handleResizeMouseUp);
  });

  const handleTouchEnd = useEventCallback((nativeEvent) => {
    const finger = trackFinger(nativeEvent, touchId.current);

    if (!finger) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();

    apiRef.current!.updateColumn(colDefRef.current as ColDef);

    clearTimeout(stopResizeEventTimeout.current);
    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current.publishEvent(COL_RESIZE_STOP);
    });

    logger.debug(
      `Updating col ${colDefRef.current!.field} with new width: ${colDefRef.current!.width}`,
    );
  });

  const handleTouchMove = useEventCallback((nativeEvent) => {
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
    newWidth = Math.max(MIN_COL_WIDTH, newWidth);

    updateWidth(newWidth);
  });

  const handleTouchStart = useEventCallback((event) => {
    const cellSeparator = findParentElementFromClassName(
      event.target,
      HEADER_CELL_SEPARATOR_RESIZABLE_CSS_CLASS,
    );
    // Let the event bubble if the target is not a col separator
    if (!cellSeparator) return;
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
      HEADER_CELL_CSS_CLASS,
    ) as HTMLDivElement;
    const field = getFieldFromHeaderElem(colElementRef.current!);
    const colDef = apiRef.current.getColumnFromField(field);

    logger.debug(`Start Resize on col ${colDef.field}`);
    apiRef.current.publishEvent(COL_RESIZE_START, { field });

    colDefRef.current = colDef;
    colElementRef.current = findHeaderElementFromField(
      columnsHeaderElement!,
      colDef.field,
    ) as HTMLDivElement;
    colCellElementsRef.current = findCellElementsFromCol(colElementRef.current) as NodeListOf<
      Element
    >;

    initialOffset.current =
      (colDefRef.current.width as number) -
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

  React.useEffect(() => {
    columnsHeaderElement?.addEventListener('touchstart', handleTouchStart, {
      passive: doesSupportTouchActionNone(),
    });

    return () => {
      columnsHeaderElement?.removeEventListener('touchstart', handleTouchStart);

      clearTimeout(stopResizeEventTimeout.current);
      stopListening();
    };
  }, [columnsHeaderElement, handleTouchStart, stopListening]);

  return React.useMemo(
    () => ({
      onMouseDown: handleMouseDown,
    }),
    [handleMouseDown],
  );
};
