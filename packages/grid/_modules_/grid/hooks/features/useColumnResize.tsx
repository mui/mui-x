import * as React from 'react';
import { ownerDocument } from '@material-ui/core/utils';
import { ColDef } from '../../models/colDef';
import { useLogger } from '../utils';
import { useEventCallback } from '../../utils/material-ui-utils';
import { COL_RESIZE_START, COL_RESIZE_STOP } from '../../constants/eventsConstants';
import { HEADER_CELL_CSS_CLASS } from '../../constants/cssClassesConstants';
import { findCellElementsFromCol } from '../../utils';
import { ApiRef } from '../../models';

const MIN_COL_WIDTH = 50;

export const useColumnResize = (columnsRef: React.RefObject<HTMLDivElement>, apiRef: ApiRef) => {
  const logger = useLogger('useColumnResize');
  const colDefRef = React.useRef<ColDef>();
  const colElementRef = React.useRef<HTMLDivElement>();
  const colCellElementsRef = React.useRef<NodeListOf<Element>>();
  const initialOffset = React.useRef<number>();
  const stopResizeEventTimeout = React.useRef<number>();

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

    colElementRef.current = event.currentTarget.closest(
      `.${HEADER_CELL_CSS_CLASS}`,
    ) as HTMLDivElement;
    const field = colElementRef.current.getAttribute('data-field') as string;
    const colDef = apiRef.current.getColumnFromField(field);

    logger.debug(`Start Resize on col ${colDef.field}`);
    apiRef.current.publishEvent(COL_RESIZE_START, { field });

    colDefRef.current = colDef;
    colElementRef.current = columnsRef.current!.querySelector(
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

  const stopListening = React.useCallback(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
    doc.body.style.removeProperty('cursor');
    doc.removeEventListener('mousemove', handleResizeMouseMove);
    doc.removeEventListener('mouseup', handleResizeMouseUp);
  }, [apiRef, handleResizeMouseMove, handleResizeMouseUp]);

  React.useEffect(() => {
    return () => {
      clearTimeout(stopResizeEventTimeout.current);
      stopListening();
    };
  }, [stopListening]);

  return React.useMemo(() => ({ onMouseDown: handleMouseDown }), [handleMouseDown]);
};
