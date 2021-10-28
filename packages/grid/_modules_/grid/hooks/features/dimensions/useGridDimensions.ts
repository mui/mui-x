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
import { gridPaginationSelector } from '../pagination';
import { gridVisibleRowCountSelector } from '../filter';
import { gridDensityRowHeightSelector } from '../density';
import { useGridSelector } from '../../utils';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export function useGridDimensions(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'rows' | 'onResize' | 'scrollbarSize' | 'pagination' | 'headerHeight' | 'autoHeight'
  >,
) {
  const logger = useGridLogger(apiRef, 'useResizeContainer');
  const warningShown = React.useRef(false);
  const rootDimensionsRef = React.useRef<ElementSize | null>(null);
  const fullDimensionsRef = React.useRef<GridDimensions | null>(null);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const visibleRowsCount = useGridSelector(apiRef, gridVisibleRowCountSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

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
      doc.appendChild(scrollDiv);
      scrollBarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      doc.removeChild(scrollDiv);
    }

    const viewportOuterSize: ElementSize = {
      width: rootDimensionsRef.current.width,
      height: rootDimensionsRef.current.height - props.headerHeight,
    };

    // TODO: Use `useCurrentPageRows`
    const currentPageRowCount = props.pagination
      ? Math.min(
          visibleRowsCount - paginationState.page * paginationState.pageSize,
          paginationState.pageSize,
        )
      : visibleRowsCount;
    const noScrollPageHeight = currentPageRowCount * rowHeight;

    let hasScrollX = columnsTotalWidth > viewportOuterSize.width;
    const noScrollPageHeightWithScrollBar = noScrollPageHeight + (hasScrollX ? scrollBarSize : 0);
    const hasScrollY = noScrollPageHeightWithScrollBar > viewportOuterSize.height;

    // We recalculate the scroll x to consider the size of the y scrollbar.
    if (hasScrollY) {
      hasScrollX = columnsTotalWidth + scrollBarSize > viewportOuterSize.width;
    }

    const viewportInnerSize: ElementSize = {
      height: viewportOuterSize.height - (hasScrollX ? scrollBarSize : 0),
      width: viewportOuterSize.width - (hasScrollY ? scrollBarSize : 0),
    };

    const rowsInViewportCount = Math.min(
      currentPageRowCount,
      Math.floor(viewportInnerSize.height / rowHeight),
    );

    const newFullDimensions: GridDimensions = {
      viewportOuterSize,
      viewportInnerSize,
      rowsInViewportCount,
      currentPageRowCount,
      hasScrollX,
      hasScrollY,
    };

    const prevDimensions = fullDimensionsRef.current;
    fullDimensionsRef.current = newFullDimensions;

    if (newFullDimensions.viewportInnerSize.width !== prevDimensions?.viewportInnerSize.width) {
      apiRef.current.publishEvent(
        GridEvents.viewportWidthChange,
        newFullDimensions.viewportInnerSize.width,
      );
    }
  }, [
    apiRef,
    props.pagination,
    props.headerHeight,
    props.scrollbarSize,
    rowHeight,
    visibleRowsCount,
    paginationState,
    columnsTotalWidth,
  ]);

  const resize = React.useCallback<GridDimensionsApi['resize']>(() => {
    updateGridDimensionsRef();
    apiRef.current.publishEvent(GridEvents.debouncedResize, rootDimensionsRef.current);
  }, [apiRef, updateGridDimensionsRef]);

  const getDimensions = React.useCallback<GridDimensionsApi['getDimensions']>(
    () => fullDimensionsRef.current,
    [],
  );

  const dimensionsApi: GridDimensionsApi = {
    resize,
    getDimensions,
  };

  useGridApiMethod(apiRef, dimensionsApi, 'GridEventsApi');

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
