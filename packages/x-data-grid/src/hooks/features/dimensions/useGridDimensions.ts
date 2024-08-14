import * as React from 'react';
import {
  unstable_ownerDocument as ownerDocument,
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_useEventCallback as useEventCallback,
  unstable_ownerWindow as ownerWindow,
} from '@mui/utils';
import { throttle } from '@mui/x-internals/throttle';
import { GridEventListener } from '../../../models/events';
import { ElementSize } from '../../../models';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridDimensions, GridDimensionsApi, GridDimensionsPrivateApi } from './gridDimensionsApi';
import {
  gridColumnsTotalWidthSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
} from '../columns';
import { gridDimensionsSelector } from './gridDimensionsSelectors';
import { gridDensityFactorSelector } from '../density';
import { gridRenderContextSelector } from '../virtualization';
import { useGridSelector } from '../../utils';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { calculatePinnedRowsHeight } from '../rows/gridRowsUtils';
import { getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

type RootProps = Pick<
  DataGridProcessedProps,
  | 'onResize'
  | 'scrollbarSize'
  | 'pagination'
  | 'paginationMode'
  | 'autoHeight'
  | 'getRowHeight'
  | 'rowHeight'
  | 'resizeThrottleMs'
  | 'columnHeaderHeight'
  | 'headerFilterHeight'
>;

export type GridDimensionsState = GridDimensions;

const EMPTY_SIZE: ElementSize = { width: 0, height: 0 };
const EMPTY_DIMENSIONS: GridDimensions = {
  isReady: false,
  root: EMPTY_SIZE,
  viewportOuterSize: EMPTY_SIZE,
  viewportInnerSize: EMPTY_SIZE,
  contentSize: EMPTY_SIZE,
  minimumSize: EMPTY_SIZE,
  hasScrollX: false,
  hasScrollY: false,
  scrollbarSize: 0,
  headerHeight: 0,
  headerFilterHeight: 0,
  rowWidth: 0,
  rowHeight: 0,
  columnsTotalWidth: 0,
  leftPinnedWidth: 0,
  rightPinnedWidth: 0,
  headersTotalHeight: 0,
  topContainerHeight: 0,
  bottomContainerHeight: 0,
};

export const dimensionsStateInitializer: GridStateInitializer<RootProps> = (state) => {
  const dimensions = EMPTY_DIMENSIONS;

  return {
    ...state,
    dimensions,
  };
};

export function useGridDimensions(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: RootProps,
) {
  const logger = useGridLogger(apiRef, 'useResizeContainer');
  const errorShown = React.useRef(false);
  const rootDimensionsRef = React.useRef(EMPTY_SIZE);
  const dimensionsState = useGridSelector(apiRef, gridDimensionsSelector);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const rowHeight = Math.floor(props.rowHeight * densityFactor);
  const headerHeight = Math.floor(props.columnHeaderHeight * densityFactor);
  const headerFilterHeight = Math.floor(
    (props.headerFilterHeight ?? props.columnHeaderHeight) * densityFactor,
  );
  const columnsTotalWidth = roundToDecimalPlaces(gridColumnsTotalWidthSelector(apiRef), 6);
  const headersTotalHeight = getTotalHeaderHeight(apiRef, props);

  const leftPinnedWidth = pinnedColumns.left.reduce((w, col) => w + col.computedWidth, 0);
  const rightPinnedWidth = pinnedColumns.right.reduce((w, col) => w + col.computedWidth, 0);

  const [savedSize, setSavedSize] = React.useState<ElementSize>();
  const debouncedSetSavedSize = React.useMemo(
    () => throttle(setSavedSize, props.resizeThrottleMs),
    [props.resizeThrottleMs],
  );
  const previousSize = React.useRef<ElementSize>();

  const getRootDimensions = () => apiRef.current.state.dimensions;

  const setDimensions = useEventCallback((dimensions: GridDimensions) => {
    apiRef.current.setState((state) => ({ ...state, dimensions }));
  });

  const resize = React.useCallback(() => {
    const element = apiRef.current.mainElementRef.current;
    if (!element) {
      return;
    }

    const computedStyle = ownerWindow(element).getComputedStyle(element);

    const newSize = {
      width: parseFloat(computedStyle.width) || 0,
      height: parseFloat(computedStyle.height) || 0,
    };

    if (!previousSize.current || !areElementSizesEqual(previousSize.current, newSize)) {
      apiRef.current.publishEvent('resize', newSize);
      previousSize.current = newSize;
    }
  }, [apiRef]);

  const getViewportPageSize = React.useCallback(() => {
    const dimensions = gridDimensionsSelector(apiRef.current.state);
    if (!dimensions.isReady) {
      return 0;
    }

    const currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode,
    });

    // TODO: Use a combination of scrollTop, dimensions.viewportInnerSize.height and rowsMeta.possitions
    // to find out the maximum number of rows that can fit in the visible part of the grid
    if (props.getRowHeight) {
      const renderContext = gridRenderContextSelector(apiRef);
      const viewportPageSize = renderContext.lastRowIndex - renderContext.firstRowIndex;

      return Math.min(viewportPageSize - 1, currentPage.rows.length);
    }

    const maximumPageSizeWithoutScrollBar = Math.floor(
      dimensions.viewportInnerSize.height / rowHeight,
    );

    return Math.min(maximumPageSizeWithoutScrollBar, currentPage.rows.length);
  }, [apiRef, props.pagination, props.paginationMode, props.getRowHeight, rowHeight]);

  const updateDimensions = React.useCallback(() => {
    const rootElement = apiRef.current.rootElementRef.current;
    const pinnedRowsHeight = calculatePinnedRowsHeight(apiRef);

    const scrollbarSize = measureScrollbarSize(rootElement, columnsTotalWidth, props.scrollbarSize);

    const topContainerHeight = headersTotalHeight + pinnedRowsHeight.top;
    const bottomContainerHeight = pinnedRowsHeight.bottom;

    const nonPinnedColumnsTotalWidth = columnsTotalWidth - leftPinnedWidth - rightPinnedWidth;

    const contentSize = {
      width: nonPinnedColumnsTotalWidth,
      height: rowsMeta.currentPageTotalHeight,
    };

    let viewportOuterSize: ElementSize;
    let viewportInnerSize: ElementSize;
    let hasScrollX = false;
    let hasScrollY = false;

    if (props.autoHeight) {
      hasScrollY = false;
      hasScrollX = Math.round(columnsTotalWidth) > Math.round(rootDimensionsRef.current.width);

      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: topContainerHeight + bottomContainerHeight + contentSize.height,
      };
      viewportInnerSize = {
        width: Math.max(0, viewportOuterSize.width - (hasScrollY ? scrollbarSize : 0)),
        height: Math.max(0, viewportOuterSize.height - (hasScrollX ? scrollbarSize : 0)),
      };
    } else {
      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: rootDimensionsRef.current.height,
      };
      viewportInnerSize = {
        width: Math.max(0, viewportOuterSize.width - leftPinnedWidth - rightPinnedWidth),
        height: Math.max(0, viewportOuterSize.height - topContainerHeight - bottomContainerHeight),
      };

      const content = contentSize;
      const container = viewportInnerSize;

      const hasScrollXIfNoYScrollBar = content.width > container.width;
      const hasScrollYIfNoXScrollBar = content.height > container.height;

      if (hasScrollXIfNoYScrollBar || hasScrollYIfNoXScrollBar) {
        hasScrollY = hasScrollYIfNoXScrollBar;
        hasScrollX = content.width + (hasScrollY ? scrollbarSize : 0) > container.width;

        // We recalculate the scroll y to consider the size of the x scrollbar.
        if (hasScrollX) {
          hasScrollY = content.height + scrollbarSize > container.height;
        }
      }

      if (hasScrollY) {
        viewportInnerSize.width -= scrollbarSize;
      }
      if (hasScrollX) {
        viewportInnerSize.height -= scrollbarSize;
      }
    }

    const rowWidth = Math.max(
      viewportOuterSize.width,
      columnsTotalWidth + (hasScrollY ? scrollbarSize : 0),
    );

    const minimumSize = {
      width: columnsTotalWidth,
      height: topContainerHeight + contentSize.height + bottomContainerHeight,
    };

    const newDimensions: GridDimensions = {
      isReady: true,
      root: rootDimensionsRef.current,
      viewportOuterSize,
      viewportInnerSize,
      contentSize,
      minimumSize,
      hasScrollX,
      hasScrollY,
      scrollbarSize,
      headerHeight,
      headerFilterHeight,
      rowWidth,
      rowHeight,
      columnsTotalWidth,
      leftPinnedWidth,
      rightPinnedWidth,
      headersTotalHeight,
      topContainerHeight,
      bottomContainerHeight,
    };

    const prevDimensions = apiRef.current.state.dimensions;
    setDimensions(newDimensions);

    if (!areElementSizesEqual(newDimensions.viewportInnerSize, prevDimensions.viewportInnerSize)) {
      apiRef.current.publishEvent('viewportInnerSizeChange', newDimensions.viewportInnerSize);
    }

    apiRef.current.updateRenderContext?.();
  }, [
    apiRef,
    setDimensions,
    props.scrollbarSize,
    props.autoHeight,
    rowsMeta.currentPageTotalHeight,
    rowHeight,
    headerHeight,
    headerFilterHeight,
    columnsTotalWidth,
    headersTotalHeight,
    leftPinnedWidth,
    rightPinnedWidth,
  ]);

  const apiPublic: GridDimensionsApi = {
    resize,
    getRootDimensions,
  };

  const apiPrivate: GridDimensionsPrivateApi = {
    updateDimensions,
    getViewportPageSize,
  };

  useGridApiMethod(apiRef, apiPublic, 'public');
  useGridApiMethod(apiRef, apiPrivate, 'private');

  useEnhancedEffect(() => {
    if (savedSize) {
      updateDimensions();
      apiRef.current.publishEvent('debouncedResize', rootDimensionsRef.current!);
    }
  }, [apiRef, savedSize, updateDimensions]);

  const root = apiRef.current.rootElementRef.current;
  useEnhancedEffect(() => {
    if (!root) {
      return;
    }
    const set = (k: string, v: string) => root.style.setProperty(k, v);
    set('--DataGrid-width', `${dimensionsState.viewportOuterSize.width}px`);
    set('--DataGrid-hasScrollX', `${Number(dimensionsState.hasScrollX)}`);
    set('--DataGrid-hasScrollY', `${Number(dimensionsState.hasScrollY)}`);
    set('--DataGrid-scrollbarSize', `${dimensionsState.scrollbarSize}px`);
    set('--DataGrid-rowWidth', `${dimensionsState.rowWidth}px`);
    set('--DataGrid-columnsTotalWidth', `${dimensionsState.columnsTotalWidth}px`);
    set('--DataGrid-leftPinnedWidth', `${dimensionsState.leftPinnedWidth}px`);
    set('--DataGrid-rightPinnedWidth', `${dimensionsState.rightPinnedWidth}px`);
    set('--DataGrid-headerHeight', `${dimensionsState.headerHeight}px`);
    set('--DataGrid-headersTotalHeight', `${dimensionsState.headersTotalHeight}px`);
    set('--DataGrid-topContainerHeight', `${dimensionsState.topContainerHeight}px`);
    set('--DataGrid-bottomContainerHeight', `${dimensionsState.bottomContainerHeight}px`);
    set('--height', `${dimensionsState.rowHeight}px`);
  }, [root, dimensionsState]);

  const isFirstSizing = React.useRef(true);
  const handleResize = React.useCallback<GridEventListener<'resize'>>(
    (size) => {
      rootDimensionsRef.current = size;

      // jsdom has no layout capabilities
      const isJSDOM = /jsdom/.test(window.navigator.userAgent);

      if (size.height === 0 && !errorShown.current && !props.autoHeight && !isJSDOM) {
        logger.error(
          [
            'The parent DOM element of the data grid has an empty height.',
            'Please make sure that this element has an intrinsic height.',
            'The grid displays with a height of 0px.',
            '',
            'More details: https://mui.com/r/x-data-grid-no-dimensions.',
          ].join('\n'),
        );
        errorShown.current = true;
      }
      if (size.width === 0 && !errorShown.current && !isJSDOM) {
        logger.error(
          [
            'The parent DOM element of the data grid has an empty width.',
            'Please make sure that this element has an intrinsic width.',
            'The grid displays with a width of 0px.',
            '',
            'More details: https://mui.com/r/x-data-grid-no-dimensions.',
          ].join('\n'),
        );
        errorShown.current = true;
      }

      if (isFirstSizing.current) {
        // We want to initialize the grid dimensions as soon as possible to avoid flickering
        setSavedSize(size);
        isFirstSizing.current = false;
        return;
      }

      debouncedSetSavedSize(size);
    },
    [props.autoHeight, debouncedSetSavedSize, logger],
  );

  useEnhancedEffect(updateDimensions, [updateDimensions]);

  useGridApiOptionHandler(apiRef, 'sortedRowsSet', updateDimensions);
  useGridApiOptionHandler(apiRef, 'paginationModelChange', updateDimensions);
  useGridApiOptionHandler(apiRef, 'columnsChange', updateDimensions);
  useGridApiEventHandler(apiRef, 'resize', handleResize);
  useGridApiOptionHandler(apiRef, 'debouncedResize', props.onResize);
}

function measureScrollbarSize(
  rootElement: Element | null,
  columnsTotalWidth: number,
  scrollbarSize: number | undefined,
) {
  if (scrollbarSize !== undefined) {
    return scrollbarSize;
  }

  if (rootElement === null || columnsTotalWidth === 0) {
    return 0;
  }

  const doc = ownerDocument(rootElement);
  const scrollDiv = doc.createElement('div');
  scrollDiv.style.width = '99px';
  scrollDiv.style.height = '99px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.className = 'scrollDiv';
  rootElement.appendChild(scrollDiv);
  const size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  rootElement.removeChild(scrollDiv);
  return size;
}

// Get rid of floating point imprecision errors
// https://github.com/mui/mui-x/issues/9550#issuecomment-1619020477
function roundToDecimalPlaces(value: number, decimals: number) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function areElementSizesEqual(a: ElementSize, b: ElementSize) {
  return a.width === b.width && a.height === b.height;
}
