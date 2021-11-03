import * as React from 'react';
import {
  debounce,
  ownerDocument,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material/utils';
import { GridEvents } from '../../../constants/eventsConstants';
import { ElementSize, GridApiRef } from '../../../models';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridDimensions, GridDimensionsApi } from './gridDimensionsApi';
import { gridColumnsTotalWidthSelector } from '../columns';
import { gridDensityHeaderHeightSelector, gridDensityRowHeightSelector } from '../density';
import { useGridSelector } from '../../utils';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export function useGridDimensions(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'rows' | 'onResize' | 'scrollbarSize' | 'pagination' | 'paginationMode' | 'autoHeight'
  >,
) {
  const logger = useGridLogger(apiRef, 'useResizeContainer');
  const warningShown = React.useRef(false);
  const rootDimensionsRef = React.useRef<ElementSize | null>(null);
  const fullDimensionsRef = React.useRef<GridDimensions | null>(null);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const currentPage = useCurrentPageRows(apiRef, props);

  const updateGridDimensionsRef = React.useCallback(() => {
    const rootElement = apiRef.current.rootElementRef?.current;

    if (!rootDimensionsRef.current) {
      return;
    }

    let scrollBarSize: number;
    if (props.scrollbarSize != null) {
      scrollBarSize = props.scrollbarSize;
    } else if (!columnsTotalWidth || !rootElement) {
      scrollBarSize = 0;
    } else {
      const doc = ownerDocument(rootElement);
      const scrollDiv = doc.createElement('div');
      scrollDiv.style.width = '99px';
      scrollDiv.style.height = '99px';
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.overflow = 'scroll';
      scrollDiv.className = 'scrollDiv';
      rootElement.appendChild(scrollDiv);
      scrollBarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      rootElement.removeChild(scrollDiv);
    }

    const virtualRowsCount = currentPage.range
      ? currentPage.range.lastRowIndex - currentPage.range.firstRowIndex + 1
      : 0;
    const pageScrollHeight = virtualRowsCount * rowHeight;

    const viewportOuterSize: ElementSize = {
      width: rootDimensionsRef.current.width,
      height: props.autoHeight
        ? virtualRowsCount * rowHeight
        : rootDimensionsRef.current.height - headerHeight,
    };

    const hasScrollXIfNoYScrollBar = Math.round(columnsTotalWidth) > viewportOuterSize.width;
    const hasScrollYIfNoXScrollBar = pageScrollHeight > viewportOuterSize.height;

    let hasScrollX: boolean;
    let hasScrollY: boolean;
    if (!hasScrollXIfNoYScrollBar && !hasScrollYIfNoXScrollBar) {
      hasScrollX = false;
      hasScrollY = false;
    } else {
      hasScrollX = hasScrollXIfNoYScrollBar;
      hasScrollY = pageScrollHeight + (hasScrollX ? scrollBarSize : 0) > viewportOuterSize.height;

      // We recalculate the scroll x to consider the size of the y scrollbar.
      if (hasScrollY) {
        hasScrollX = columnsTotalWidth + scrollBarSize > viewportOuterSize.width;
      }
    }

    const viewportInnerSize: ElementSize = {
      height: viewportOuterSize.height - (hasScrollX ? scrollBarSize : 0),
      width: viewportOuterSize.width - (hasScrollY ? scrollBarSize : 0),
    };

    const maximumPageSizeWithoutScrollBar = Math.floor(viewportInnerSize.height / rowHeight);
    const rowsInViewportCount = Math.min(virtualRowsCount, maximumPageSizeWithoutScrollBar);

    const newFullDimensions: GridDimensions = {
      viewportOuterSize,
      viewportInnerSize,
      maximumPageSizeWithoutScrollBar,
      rowsInViewportCount,
      virtualRowsCount,
      hasScrollX,
      hasScrollY,
    };

    const prevDimensions = fullDimensionsRef.current;
    fullDimensionsRef.current = newFullDimensions;

    if (
      newFullDimensions.maximumPageSizeWithoutScrollBar !==
      prevDimensions?.maximumPageSizeWithoutScrollBar
    ) {
      apiRef.current.publishEvent(
        GridEvents.maximumPageSizeWithoutScrollBarChange,
        newFullDimensions.maximumPageSizeWithoutScrollBar,
      );
    }
    if (newFullDimensions.viewportInnerSize.width !== prevDimensions?.viewportInnerSize.width) {
      apiRef.current.publishEvent(
        GridEvents.viewportInnerWidthChange,
        newFullDimensions.viewportInnerSize.width,
      );
    }
  }, [
    apiRef,
    currentPage.range,
    props.scrollbarSize,
    props.autoHeight,
    headerHeight,
    rowHeight,
    columnsTotalWidth,
  ]);

  const resize = React.useCallback<GridDimensionsApi['resize']>(() => {
    updateGridDimensionsRef();
    apiRef.current.publishEvent(GridEvents.debouncedResize, rootDimensionsRef.current);
  }, [apiRef, updateGridDimensionsRef]);

  const getRootDimensions = React.useCallback<GridDimensionsApi['getRootDimensions']>(
    () => fullDimensionsRef.current,
    [],
  );

  const dimensionsApi: GridDimensionsApi = {
    resize,
    getRootDimensions,
  };

  useGridApiMethod(apiRef, dimensionsApi, 'GridDimensionsApi');

  const debounceResize = React.useMemo(() => debounce(resize, 60), [resize]);

  const handleResize = React.useCallback(
    (size: ElementSize) => {
      rootDimensionsRef.current = size;

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

      console.log('HEY');

      debounceResize();
    },
    [props.autoHeight, debounceResize, logger, resize],
  );

  React.useEffect(() => {
    logger.info('canceling resize...');
    debounceResize.clear();
  }, [props.rows, logger]); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => updateGridDimensionsRef(), [updateGridDimensionsRef]);

  useGridApiEventHandler(apiRef, GridEvents.resize, handleResize);
  useGridApiOptionHandler(apiRef, GridEvents.debouncedResize, props.onResize);
}
