import * as React from 'react';
import { debounce, ownerDocument } from '@mui/material/utils';
import { GridEvents } from '../../../constants/eventsConstants';
import { ElementSize, GridApiRef } from '../../../models';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridDimensionsApi } from './gridDimensionsApi';
import { gridColumnsTotalWidthSelector } from '../columns';
import { gridPaginationSelector } from '../pagination';
import { gridVisibleRowCountSelector } from '../filter';
import { gridDensityRowHeightSelector } from '../density';

const isTestEnvironment = process.env.NODE_ENV === 'test';

function getScrollbarSize(doc: Document, element: HTMLElement): number {
  const scrollDiv = doc.createElement('div');
  scrollDiv.style.width = '99px';
  scrollDiv.style.height = '99px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.className = 'scrollDiv';
  element.appendChild(scrollDiv);
  const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  element.removeChild(scrollDiv);

  return scrollbarSize;
}

export function useGridDimensions(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'autoHeight'
    | 'rows'
    | 'onResize'
    | 'scrollbarSize'
    | 'pagination'
    | 'autoPageSize'
    | 'pageSize'
  >,
) {
  const logger = useGridLogger(apiRef, 'useResizeContainer');
  const warningShown = React.useRef(false);

  const resize = React.useCallback<GridDimensionsApi['resize']>(() => {
    logger.debug(`resizing...`);

    apiRef.current.publishEvent(
      GridEvents.debouncedResize,
      apiRef.current.state.containerSizes?.windowSizes,
    );
  }, [apiRef, logger]);

  const getDimensions = React.useCallback<GridDimensionsApi['getDimensions']>(() => {
    const windowElement = apiRef.current.windowRef?.current;
    const rootElement = apiRef.current.rootElementRef?.current;
    const columnsTotalWidth = gridColumnsTotalWidthSelector(apiRef.current.state);

    if (!windowElement) {
      return {
        window: {
          height: 0,
          width: 0,
        },
        viewport: {
          height: 0,
          width: 0,
        },
        rowsInViewportCount: 0,
        paginatedRowCount: 0,
        hasScrollX: false,
        hasScrollY: false,
      };
    }

    const paginationState = gridPaginationSelector(apiRef.current.state);
    const visibleRowsCount = gridVisibleRowCountSelector(apiRef.current.state);
    const rowHeight = gridDensityRowHeightSelector(apiRef.current.state);

    const paginatedRowCount = props.pagination
      ? Math.min(
          visibleRowsCount - paginationState.page * paginationState.pageSize,
          paginationState.pageSize,
        )
      : visibleRowsCount;
    const noScrollPageHeight = paginatedRowCount * rowHeight;

    const windowBoundingClientRect = windowElement.getBoundingClientRect();
    const windowDimensions: ElementSize = {
      height: windowBoundingClientRect.height,
      width: windowBoundingClientRect.width,
    }

    let scrollBarSize: number;
    if (props.scrollbarSize != null) {
      scrollBarSize = props.scrollbarSize;
    } else if (!columnsTotalWidth || !rootElement) {
      scrollBarSize = 0;
    } else {
      const doc = ownerDocument(rootElement);
      scrollBarSize = getScrollbarSize(doc, rootElement);
    }

    // The height of the grid will exactly match the height needed to display the current page
    // They can be no scroll in the Y direction
    if (props.autoHeight) {
      const hasScrollX = columnsTotalWidth > windowDimensions.width;
      const scrollBarHeight = hasScrollX ? scrollBarSize : 0;

      return {
        window: windowDimensions,
        viewport: {
          width: windowDimensions.width,
          height: noScrollPageHeight + scrollBarHeight, // TODO: Fix for `props.autoPageSize`,
        },
        rowsInViewportCount: paginatedRowCount,
        paginatedRowCount,
        hasScrollX,
        hasScrollY: false,
      };
    }

    let scrollBarWidth: number = 0;
    let scrollBarHeight: number = 0;

    let hasScrollX = columnsTotalWidth > windowDimensions.width;
    if (hasScrollX) {
      scrollBarHeight = scrollBarSize;
    }

    const hasScrollY = noScrollPageHeight + scrollBarHeight > windowDimensions.height;
    if (hasScrollY) {
      scrollBarWidth = scrollBarSize;
    }

    // We recalculate the scroll x to consider the size of the y scrollbar.
    hasScrollX = columnsTotalWidth + scrollBarWidth > windowDimensions.width;
    if (hasScrollX) {
      scrollBarHeight = scrollBarSize;
    }

    const viewportHeight = windowDimensions.width - scrollBarWidth;

    return {
      window: windowDimensions,
      viewport: {
        height: viewportHeight,
        width: windowDimensions.height - scrollBarHeight,
      },
      rowsInViewportCount: Math.floor(viewportHeight / rowHeight),
      paginatedRowCount,
      hasScrollX,
      hasScrollY,
    };
  }, [apiRef, props.autoHeight, props.pagination, props.scrollbarSize]);

  const dimensionsApi: GridDimensionsApi = {
    resize,
    getDimensions,
  };

  useGridApiMethod(apiRef, dimensionsApi, 'GridEventsApi');

  const debounceResize = React.useMemo(() => debounce(resize, 60), [resize]);

  const handleResize = React.useCallback(
    (size: ElementSize) => {
      // jsdom has no layout capabilities
      const isJSDOM = /jsdom/.test(window.navigator.userAgent);

      if (size.height === 0 && !warningShown.current && !props.autoHeight && !isJSDOM) {
        logger.warn(
          [
            'The parent of the grid has an empty height.',
            'You need to make sure the container has an intrinsic height.',
            'The grid displays with a height of 0px.',
            '',
            'You can find a solution in the docs:',
            'https://mui.com/components/data-grid/layout/',
          ].join('\n'),
        );
        warningShown.current = true;
      }
      if (size.width === 0 && !warningShown.current && !isJSDOM) {
        logger.warn(
          [
            'The parent of the grid has an empty width.',
            'You need to make sure the container has an intrinsic width.',
            'The grid displays with a width of 0px.',
            '',
            'You can find a solution in the docs:',
            'https://mui.com/components/data-grid/layout/',
          ].join('\n'),
        );
        warningShown.current = true;
      }

      if (isTestEnvironment) {
        // We don't need to debounce the resize for tests.
        resize();
        return;
      }

      debounceResize();
    },
    [props.autoHeight, debounceResize, logger, resize],
  );

  React.useEffect(() => {
    return () => {
      logger.info('canceling resize...');
      debounceResize.clear();
    };
  }, [logger, debounceResize]);

  React.useEffect(() => {
    logger.info('canceling resize...');
    debounceResize.clear();
  }, [props.rows, debounceResize, logger]);

  useGridApiEventHandler(apiRef, GridEvents.resize, handleResize);
  useGridApiOptionHandler(apiRef, GridEvents.debouncedResize, props.onResize);
}
