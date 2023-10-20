import * as React from 'react';
import {
  unstable_debounce as debounce,
  unstable_ownerDocument as ownerDocument,
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_useEventCallback as useEventCallback,
  unstable_ownerWindow as ownerWindow,
} from '@mui/utils';
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
import { gridColumnsTotalWidthSelector } from '../columns';
import { gridDensityFactorSelector } from '../density';
import { useGridSelector } from '../../utils';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { calculatePinnedRowsHeight } from '../rows/gridRowsUtils';
import { getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

const isTestEnvironment = process.env.NODE_ENV === 'test';

type RootProps = Pick<
  DataGridProcessedProps,
  | 'onResize'
  | 'scrollbarSize'
  | 'pagination'
  | 'paginationMode'
  | 'autoHeight'
  | 'getRowHeight'
  | 'rowHeight'
  | 'columnHeaderHeight'
>;

export type GridDimensionsState = GridDimensions;

const EMPTY_SIZE: ElementSize = { width: 0, height: 0 };
const EMPTY_DIMENSIONS: GridDimensions = {
  isReady: false,
  root: EMPTY_SIZE,
  viewportOuterSize: EMPTY_SIZE,
  viewportInnerSize: EMPTY_SIZE,
  contentSize: EMPTY_SIZE,
  hasScrollX: false,
  hasScrollY: false,
  scrollBarSize: 0,
  headerHeight: 0,
  columnsTotalWidth: 0,
  headersTotalHeight: 0,
  topContainerHeight: 0,
  bottomContainerHeight: 0,
};

export const dimensionsStateInitializer: GridStateInitializer<RootProps> = (state, _props) => {
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
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const rowHeight = Math.floor(props.rowHeight * densityFactor);
  const headerHeight = Math.floor(props.columnHeaderHeight * densityFactor);
  const columnsTotalWidth = gridColumnsTotalWidthSelector(apiRef);
  const hasHeaderFilters = Boolean((props as any).unstable_headerFilters); // XXX: this is kinda unsafe
  const headersTotalHeight =
    getTotalHeaderHeight(apiRef, props.columnHeaderHeight) +
    Number(hasHeaderFilters) * headerHeight;

  const [savedSize, setSavedSize] = React.useState<ElementSize>();
  const debouncedSetSavedSize = React.useMemo(() => debounce(setSavedSize, 60), []);
  const previousSize = React.useRef<ElementSize>();

  const getRootDimensions = () => apiRef.current.state.dimensions;

  const setDimensions = useEventCallback((dimensions: GridDimensions) => {
    apiRef.current.setState((state) => ({ ...state, dimensions }));
  });

  const resize = React.useCallback(() => {
    const mainEl = apiRef.current.mainElementRef?.current;
    if (!mainEl) {
      return;
    }

    const win = ownerWindow(mainEl);
    const computedStyle = win.getComputedStyle(mainEl);

    const height = parseFloat(computedStyle.height) || 0;
    const width = parseFloat(computedStyle.width) || 0;

    const hasHeightChanged = height !== previousSize.current?.height;
    const hasWidthChanged = width !== previousSize.current?.width;

    if (!previousSize.current || hasHeightChanged || hasWidthChanged) {
      const size = { width, height };
      apiRef.current.publishEvent('resize', size);
      previousSize.current = size;
    }
  }, [apiRef]);

  const getViewportPageSize = React.useCallback(() => {
    const dimensions = apiRef.current.getRootDimensions();
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
      const renderContext = apiRef.current.getRenderContext();
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

    const scrollBarSize = measureScrollbarSize(rootElement, columnsTotalWidth, props.scrollbarSize);

    const topContainerHeight = headersTotalHeight + pinnedRowsHeight.top;
    const bottomContainerHeight = pinnedRowsHeight.bottom;

    const contentSize = {
      width: Math.round(columnsTotalWidth),
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
        height: rowsMeta.currentPageTotalHeight + (hasScrollX ? scrollBarSize : 0),
      };
      viewportInnerSize = {
        width: viewportOuterSize.width - (hasScrollY ? scrollBarSize : 0),
        height: viewportOuterSize.height - (hasScrollX ? scrollBarSize : 0),
      };
    } else {
      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: rootDimensionsRef.current.height,
      };
      viewportInnerSize = {
        width: viewportOuterSize.width - 0 /* XXX: right/left pinned */,
        height: viewportOuterSize.height - topContainerHeight - bottomContainerHeight,
      };

      const content = contentSize;
      const container = viewportInnerSize;

      const hasScrollXIfNoYScrollBar = content.width > container.width;
      const hasScrollYIfNoXScrollBar = content.height > container.height;

      if (hasScrollXIfNoYScrollBar || hasScrollYIfNoXScrollBar) {
        hasScrollY = hasScrollYIfNoXScrollBar;
        hasScrollX = content.width + (hasScrollY ? scrollBarSize : 0) > container.width;

        // We recalculate the scroll y to consider the size of the x scrollbar.
        if (hasScrollX) {
          hasScrollY = content.height + scrollBarSize > container.height;
        }
      }

      if (hasScrollY) {
        viewportInnerSize.width -= scrollBarSize;
      }
      if (hasScrollX) {
        viewportInnerSize.height -= scrollBarSize;
      }
    }

    const newFullDimensions: GridDimensions = {
      isReady: true,
      root: rootDimensionsRef.current,
      viewportOuterSize,
      viewportInnerSize,
      contentSize,
      hasScrollX,
      hasScrollY,
      scrollBarSize,
      headerHeight,
      columnsTotalWidth,
      headersTotalHeight,
      topContainerHeight,
      bottomContainerHeight,
    };

    const prevDimensions = apiRef.current.state.dimensions;
    setDimensions(newFullDimensions);

    if (
      newFullDimensions.viewportInnerSize.width !== prevDimensions.viewportInnerSize.width ||
      newFullDimensions.viewportInnerSize.height !== prevDimensions.viewportInnerSize.height
    ) {
      apiRef.current.publishEvent('viewportInnerSizeChange', newFullDimensions.viewportInnerSize);
    }
  }, [
    apiRef,
    setDimensions,
    props.scrollbarSize,
    props.autoHeight,
    rowsMeta.currentPageTotalHeight,
    headerHeight,
    columnsTotalWidth,
    headersTotalHeight,
    hasHeaderFilters,
  ]);

  const apiPublic: GridDimensionsApi = {
    resize,
    getRootDimensions,
  };

  const apiPrivate: GridDimensionsPrivateApi = {
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

  useEnhancedEffect(() => {
    const root = apiRef.current.rootElementRef.current;
    const dimensions = apiRef.current.state.dimensions;
    if (!root) {
      return;
    }
    root.style.setProperty('--DataGrid-hasScrollX', `${Number(dimensions.hasScrollX)}`);
    root.style.setProperty('--DataGrid-hasScrollY', `${Number(dimensions.hasScrollY)}`);
    root.style.setProperty('--DataGrid-scrollbarSize', `${dimensions.scrollBarSize}px`);
    root.style.setProperty('--DataGrid-columnsTotalWidth', `${dimensions.columnsTotalWidth}px`);
    root.style.setProperty('--DataGrid-headersTotalHeight', `${dimensions.headersTotalHeight}px`);
    root.style.setProperty('--DataGrid-topContainerHeight', `${dimensions.topContainerHeight}px`);
    root.style.setProperty(
      '--DataGrid-bottomContainerHeight',
      `${dimensions.bottomContainerHeight}px`,
    );
  }, [apiRef.current.rootElementRef.current, apiRef.current.state.dimensions]);

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

      if (isTestEnvironment) {
        // We don't need to debounce the resize for tests.
        setSavedSize(size);
        isFirstSizing.current = false;
        return;
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
