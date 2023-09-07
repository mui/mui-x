import * as React from 'react';
import {
  unstable_ownerDocument as ownerDocument,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import {
  GridEventListener,
  gridClasses,
  CursorCoordinates,
  GridColumnHeaderSeparatorSides,
  GridColumnResizeParams,
  useGridApiEventHandler,
  useGridApiOptionHandler,
  useGridApiMethod,
  useGridNativeEventListener,
  useGridLogger,
  GridRenderContext,
  gridVisibleColumnFieldsSelector,
  gridDataRowIdsSelector,
} from '@mui/x-data-grid';
import {
  clamp,
  findParentElementFromClassName,
  gridColumnsStateSelector,
  waitForDOM,
  GridStateInitializer,
  GridStateColDef,
} from '@mui/x-data-grid/internals';
import { useTheme, Direction } from '@mui/material/styles';
import {
  findGridCellElementsFromCol,
  getFieldFromHeaderElem,
  findHeaderElementFromField,
  findGroupHeaderElementsFromField,
} from '../../../utils/domUtils';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  GridAutosizeOptions,
  GridColumnResizeApi,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from './gridColumnResizeApi';

type AutosizeOptionsRequired = Required<GridAutosizeOptions>;

type ResizeDirection = keyof typeof GridColumnHeaderSeparatorSides;

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
  resizeDirection: ResizeDirection,
) {
  let newWidth = initialOffsetToSeparator;
  if (resizeDirection === 'Right') {
    newWidth += clickX - columnBounds.left;
  } else {
    newWidth += columnBounds.right - clickX;
  }
  return newWidth;
}

function computeOffsetToSeparator(
  clickX: number,
  columnBounds: DOMRect,
  resizeDirection: ResizeDirection,
) {
  if (resizeDirection === 'Left') {
    return clickX - columnBounds.left;
  }
  return columnBounds.right - clickX;
}

function flipResizeDirection(side: ResizeDirection) {
  if (side === 'Right') {
    return 'Left';
  }
  return 'Right';
}

function getResizeDirection(element: HTMLElement, direction: Direction) {
  const side = element.classList.contains(gridClasses['columnSeparator--sideRight'])
    ? 'Right'
    : 'Left';
  if (direction === 'rtl') {
    // Resizing logic should be mirrored in the RTL case
    return flipResizeDirection(side);
  }
  return side;
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
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'onColumnResize' | 'onColumnWidthChange'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridColumnResize');

  const colDefRef = React.useRef<GridStateColDef>();
  const colElementRef = React.useRef<HTMLDivElement>();
  const headerFilterElementRef = React.useRef<HTMLDivElement>();
  const colGroupingElementRef = React.useRef<Element[]>();
  const colCellElementsRef = React.useRef<Element[]>();
  const theme = useTheme();

  // To improve accessibility, the separator has padding on both sides.
  // Clicking inside the padding area should be treated as a click in the separator.
  // This ref stores the offset between the click and the separator.
  const initialOffsetToSeparator = React.useRef<number>();
  const resizeDirection = React.useRef<ResizeDirection>();

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

    const headerFilterElement = headerFilterElementRef.current;

    if (headerFilterElement) {
      headerFilterElement.style.width = `${newWidth}px`;
      headerFilterElement.style.minWidth = `${newWidth}px`;
      headerFilterElement.style.maxWidth = `${newWidth}px`;
    }

    [...colCellElementsRef.current!, ...colGroupingElementRef.current!].forEach((element) => {
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

  const finishResize = (nativeEvent: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stopListening();

    if (colDefRef.current) {
      apiRef.current.setColumnWidth(colDefRef.current.field, colDefRef.current.width!);
      logger.debug(
        `Updating col ${colDefRef.current.field} with new width: ${colDefRef.current.width}`,
      );
    }

    clearTimeout(stopResizeEventTimeout.current);
    stopResizeEventTimeout.current = setTimeout(() => {
      apiRef.current.publishEvent('columnResizeStop', null, nativeEvent);
    });
  };

  const handleResizeMouseUp = useEventCallback(finishResize);

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
      resizeDirection.current!,
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

      const headerFilterRowElement = apiRef.current.headerFiltersElementRef?.current;

      if (headerFilterRowElement) {
        headerFilterElementRef.current = headerFilterRowElement.querySelector<HTMLDivElement>(
          `[data-field="${colDef.field}"]`,
        ) as HTMLDivElement;
      }

      colGroupingElementRef.current = findGroupHeaderElementsFromField(
        apiRef.current.columnHeadersContainerElementRef?.current!,
        colDef.field,
      );

      colCellElementsRef.current = findGridCellElementsFromCol(
        colElementRef.current,
        apiRef.current,
      );

      const doc = ownerDocument(apiRef.current.rootElementRef!.current);
      doc.body.style.cursor = 'col-resize';

      resizeDirection.current = getResizeDirection(event.currentTarget, theme.direction);

      initialOffsetToSeparator.current = computeOffsetToSeparator(
        event.clientX,
        colElementRef.current!.getBoundingClientRect(),
        resizeDirection.current,
      );

      doc.addEventListener('mousemove', handleResizeMouseMove);
      doc.addEventListener('mouseup', handleResizeMouseUp);

      // Fixes https://github.com/mui/mui-x/issues/4777
      colElementRef.current.style.pointerEvents = 'none';
    });

  const handleTouchEnd = useEventCallback((nativeEvent: any) => {
    const finger = trackFinger(nativeEvent, touchId.current);

    if (!finger) {
      return;
    }

    finishResize(nativeEvent);
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
      resizeDirection.current!,
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

    colGroupingElementRef.current = findGroupHeaderElementsFromField(
      apiRef.current.columnHeadersContainerElementRef?.current!,
      field,
    );
    logger.debug(`Start Resize on col ${colDef.field}`);
    apiRef.current.publishEvent('columnResizeStart', { field }, event);

    colDefRef.current = colDef as GridStateColDef;
    colElementRef.current = findHeaderElementFromField(
      apiRef.current.columnHeadersElementRef?.current!,
      colDef.field,
    ) as HTMLDivElement;
    colCellElementsRef.current = findGridCellElementsFromCol(colElementRef.current, apiRef.current);

    resizeDirection.current = getResizeDirection(event.target, theme.direction);

    initialOffsetToSeparator.current = computeOffsetToSeparator(
      touch.clientX,
      colElementRef.current!.getBoundingClientRect(),
      resizeDirection.current!,
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
    if (colElementRef.current) {
      colElementRef.current!.style.pointerEvents = 'unset';
    }
  }, [
    apiRef,
    colElementRef,
    handleResizeMouseMove,
    handleResizeMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

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

  /**
   * API METHODS
   */

  const isAutosizingRef = React.useRef(false);
  const autosizeColumns = React.useCallback<GridColumnResizeApi['autosizeColumns']>(
    async (userOptions) => {
      const root = apiRef.current.rootElementRef?.current;
      if (!root) {
        return;
      }
      if (isAutosizingRef.current) {
        throw new Error('Already autosizing the grid. This method cannot be called twice in parallel.')
      }

      const state = gridColumnsStateSelector(apiRef.current.state);
      const options = Object.assign({}, DEFAULT_GRID_AUTOSIZE_OPTIONS, userOptions, {
        columns: userOptions?.columns ?? state.orderedFields.map((field) => state.lookup[field]),
      });
      options.columns = options.columns.filter(
        (c) => state.columnVisibilityModel[c.field] !== false,
      );

      let context: GridRenderContext;
      try {
        context = await disableColumnVirtualization(apiRef, options);
        const widthsByField = extractColumnWidths(root, options);

        const newColumns = options.columns.map((column) => {
          const newColumn = { ...column, computedWidth: undefined };
          const width = widthsByField[column.field];
          newColumn.width = clamp(width.maxContent, width.min, width.max);
          return newColumn;
        });

        console.log(widthsByField);

        apiRef.current.updateColumns(newColumns);
      } finally {
        if (context!) {
          restoreColumnVirtualization(apiRef, context);
        }
      }
    },
    [],
  );

  /**
   * EFFECTS
   */

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

  useGridApiMethod(
    apiRef,
    {
      autosizeColumns,
    },
    'public',
  );

  useGridApiEventHandler(apiRef, 'columnSeparatorMouseDown', handleColumnResizeMouseDown);
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleResizeStop);

  useGridApiOptionHandler(apiRef, 'columnResize', props.onColumnResize);
  useGridApiOptionHandler(apiRef, 'columnWidthChange', props.onColumnWidthChange);
};

function extractColumnWidths(root: Element, options: AutosizeOptionsRequired) {
  type Result = Record<
    string,
    { min: number; max: number; minContent: number; maxContent: number }
  >;

  root.classList.add(gridClasses.autosizing);

  const getHeader = (field: string) =>
    root.querySelector(`[data-field="${field}"][role="columnheader"]`);

  const getCells = (field: string) =>
    Array.from(root.querySelectorAll(`[data-field="${field}"][role="cell"]`));

  const widthsByField = options.columns.reduce((result, column) => {
    const cells = getCells(column.field);
    const widths = cells.map((cell) => {
      // XXX:
      // Is there a more efficient way to do this?
      // Can we assume the cell padding is constant for all cells?
      const style = window.getComputedStyle(cell, null);
      const paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
      const contentWidth = cell.firstElementChild?.getBoundingClientRect().width ?? 0;
      return paddingWidth + contentWidth;
    });

    const filteredWidths = options.excludeOutliers
      ? excludeOutliers(widths, options.outliersFactor)
      : widths;

    if (options.includeHeaders) {
      const header = getHeader(column.field);
      if (header) {
        const content = header.querySelector(`.${gridClasses['columnHeaderTitle']}`)!;

        const style = window.getComputedStyle(header, null);
        const paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
        const contentWidth = content.getBoundingClientRect().width;
        const width = paddingWidth + contentWidth;

        filteredWidths.push(width);
      }
    }

    const hasColumnMin = column.minWidth !== -Infinity && column.minWidth !== undefined;
    const hasColumnMax = column.maxWidth !== Infinity && column.maxWidth !== undefined;
    const current = {
      min: hasColumnMin ? column.minWidth! : 0,
      max: hasColumnMax ? column.maxWidth! : Infinity,
      minContent: filteredWidths.length === 0 ? 0 : Math.min(...filteredWidths),
      maxContent: filteredWidths.length === 0 ? 0 : Math.max(...filteredWidths),
    };

    result[column.field] = current;
    return result;
  }, {} as Result);

  root.classList.remove(gridClasses.autosizing);

  return widthsByField;
}

async function disableColumnVirtualization(
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  options: AutosizeOptionsRequired,
) {
  const state = gridColumnsStateSelector(apiRef.current.state);
  const rowsLength = gridDataRowIdsSelector(apiRef).length;
  const visibleColumnsLength = gridVisibleColumnFieldsSelector(apiRef).length;

  const context = apiRef.current.getRenderContext();

  // We render a context of at least `sampleLength` rows, centered around the current context
  // to re-use as much as possible of the already rendered rows.
  const halfLength = Math.floor(options.sampleLength / 2);
  const middleRowIndex =
    context.firstRowIndex + Math.floor((context.lastRowIndex - context.firstRowIndex) / 2);
  const firstRowIndex = clamp(middleRowIndex - halfLength, 0, rowsLength);
  const lastRowIndex = clamp(firstRowIndex + options.sampleLength, 0, rowsLength);

  // Create our temporary render context. Note that if the new first/last row indexes are within
  // the currently rendered range, we just reuse those instead. That case happens when the
  // `sampleLength` is smaller than the currently rendered range.
  const newContext = {
    firstColumnIndex: 0,
    lastColumnIndex: state.orderedFields.length,
    firstRowIndex: Math.min(firstRowIndex, context.firstRowIndex),
    lastRowIndex: Math.max(lastRowIndex, context.lastRowIndex),
  }

  apiRef.current.setColumnHeadersVirtualization(false);
  apiRef.current.setRenderContext(newContext);

  const headerContainer = apiRef.current.columnHeadersElementRef!.current!;
  const cellsContainer = apiRef.current.virtualScrollerRef!.current!;
  const firstRow = cellsContainer.querySelector('[role="row"]');

  await Promise.all([
    waitForDOM({
      target: headerContainer,
      validate: () => {
        return headerContainer.querySelectorAll('[data-field]').length === visibleColumnsLength;
      },
    }),
    firstRow
      ? waitForDOM({
          target: firstRow,
          validate: () => {
            return firstRow.querySelectorAll('[data-field]').length === visibleColumnsLength;
          },
        })
      : Promise.resolve(),
  ]);

  return context;
}

function restoreColumnVirtualization(
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  context: GridRenderContext,
) {
  apiRef.current.setColumnHeadersVirtualization(true);
  apiRef.current.setRenderContext(context!);
}

function excludeOutliers(inputValues: number[], factor: number) {
  const values = inputValues.slice();
  values.sort((a, b) => a - b);

  const q1 = values[Math.floor(values.length * 0.25)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const iqr = q3 - q1;
  const deviation = iqr < 5 ? 10 : iqr * factor;

  return values.filter((v) => v > q1 - deviation && v < q3 + deviation);
}
