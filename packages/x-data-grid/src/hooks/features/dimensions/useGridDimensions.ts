import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useSelectorEffect } from '@mui/x-internals/store';
import { Dimensions } from '@mui/x-virtualizer';
import { GridEventListener } from '../../../models/events';
import { ElementSize } from '../../../models';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridEventPriority } from '../../utils/useGridEvent';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { createSelector } from '../../../utils/createSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridDimensions, GridDimensionsApi, GridDimensionsPrivateApi } from './gridDimensionsApi';
import {
  gridColumnPositionsSelector,
  gridVisibleColumnDefinitionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
} from '../columns';
import { gridDimensionsSelector } from './gridDimensionsSelectors';
import { gridDensityFactorSelector } from '../density';
import { gridRenderContextSelector } from '../virtualization';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { getValidRowHeight, rowHeightWarning } from '../rows/gridRowsUtils';
import { getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { DATA_GRID_PROPS_DEFAULT_VALUES } from '../../../constants/dataGridPropsDefaultValues';
import { roundToDecimalPlaces } from '../../../utils/roundToDecimalPlaces';
import { isJSDOM } from '../../../utils/isJSDOM';

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
  | 'columnGroupHeaderHeight'
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
  groupHeaderHeight: 0,
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

export const dimensionsStateInitializer: GridStateInitializer<RootProps> = (
  state,
  props,
  apiRef,
) => {
  const dimensions = EMPTY_DIMENSIONS;

  const density = gridDensityFactorSelector(apiRef);

  return {
    ...state,
    dimensions: {
      ...dimensions,
      ...getStaticDimensions(
        props,
        apiRef,
        density,
        gridVisiblePinnedColumnDefinitionsSelector(apiRef),
      ),
    },
  };
};

const columnsTotalWidthSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  gridColumnPositionsSelector,
  (visibleColumns, positions) => {
    const colCount = visibleColumns.length;
    if (colCount === 0) {
      return 0;
    }
    return roundToDecimalPlaces(
      positions[colCount - 1] + visibleColumns[colCount - 1].computedWidth,
      1,
    );
  },
);

export function useGridDimensions(apiRef: RefObject<GridPrivateApiCommunity>, props: RootProps) {
  const logger = useGridLogger(apiRef, 'useResizeContainer');
  const errorShown = React.useRef(false);

  const virtualizer = apiRef.current.virtualizer;
  const updateDimensions = virtualizer.dimensions.updateDimensions;

  const getRootDimensions = React.useCallback(() => gridDimensionsSelector(apiRef), [apiRef]);

  const getViewportPageSize = React.useCallback(() => {
    const dimensions = gridDimensionsSelector(apiRef);
    if (!dimensions.isReady) {
      return 0;
    }

    const currentPage = getVisibleRows(apiRef);

    // TODO: Use a combination of scrollTop, dimensions.viewportInnerSize.height and rowsMeta.possitions
    // to find out the maximum number of rows that can fit in the visible part of the grid
    if (props.getRowHeight) {
      const renderContext = gridRenderContextSelector(apiRef);
      const viewportPageSize = renderContext.lastRowIndex - renderContext.firstRowIndex;

      return Math.min(viewportPageSize - 1, currentPage.rows.length);
    }

    const maximumPageSizeWithoutScrollBar = Math.floor(
      dimensions.viewportInnerSize.height / dimensions.rowHeight,
    );

    return Math.min(maximumPageSizeWithoutScrollBar, currentPage.rows.length);
  }, [apiRef, props.getRowHeight]);

  const apiPublic: GridDimensionsApi = {
    getRootDimensions,
  };

  const apiPrivate: GridDimensionsPrivateApi = {
    updateDimensions,
    getViewportPageSize,
  };

  useGridApiMethod(apiRef, apiPublic, 'public');
  useGridApiMethod(apiRef, apiPrivate, 'private');

  const handleRootMount: GridEventListener<'rootMount'> = (root) => {
    setCSSVariables(root, gridDimensionsSelector(apiRef));
  };

  const handleResize: GridEventListener<'resize'> = (size) => {
    if (size.height === 0 && !errorShown.current && !props.autoHeight && !isJSDOM) {
      logger.error(
        [
          'The parent DOM element of the Data Grid has an empty height.',
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
          'The parent DOM element of the Data Grid has an empty width.',
          'Please make sure that this element has an intrinsic width.',
          'The grid displays with a width of 0px.',
          '',
          'More details: https://mui.com/r/x-data-grid-no-dimensions.',
        ].join('\n'),
      );
      errorShown.current = true;
    }
  };

  useGridEventPriority(apiRef, 'rootMount', handleRootMount);
  useGridEventPriority(apiRef, 'resize', handleResize);
  useGridEventPriority(apiRef, 'debouncedResize', props.onResize);

  useSelectorEffect(virtualizer.store, Dimensions.selectors.dimensions, (previous, next) => {
    if (apiRef.current.rootElementRef.current) {
      setCSSVariables(apiRef.current.rootElementRef.current, next);
    }

    if (!areElementSizesEqual(next.viewportInnerSize, previous.viewportInnerSize)) {
      apiRef.current.publishEvent('viewportInnerSizeChange', next.viewportInnerSize);
    }

    apiRef.current.updateRenderContext?.();
    apiRef.current.publishEvent('debouncedResize', next.root);
  });
}

function setCSSVariables(root: HTMLElement, dimensions: GridDimensions) {
  const set = (k: string, v: string) => root.style.setProperty(k, v);
  set('--DataGrid-hasScrollX', `${Number(dimensions.hasScrollX)}`);
  set('--DataGrid-hasScrollY', `${Number(dimensions.hasScrollY)}`);
  set('--DataGrid-scrollbarSize', `${dimensions.scrollbarSize}px`);
  set('--DataGrid-rowWidth', `${dimensions.rowWidth}px`);
  set('--DataGrid-columnsTotalWidth', `${dimensions.columnsTotalWidth}px`);
  set('--DataGrid-leftPinnedWidth', `${dimensions.leftPinnedWidth}px`);
  set('--DataGrid-rightPinnedWidth', `${dimensions.rightPinnedWidth}px`);
  set('--DataGrid-headerHeight', `${dimensions.headerHeight}px`);
  set('--DataGrid-headersTotalHeight', `${dimensions.headersTotalHeight}px`);
  set('--DataGrid-topContainerHeight', `${dimensions.topContainerHeight}px`);
  set('--DataGrid-bottomContainerHeight', `${dimensions.bottomContainerHeight}px`);
  set('--height', `${dimensions.rowHeight}px`);
}

function getStaticDimensions(
  props: RootProps,
  apiRef: RefObject<GridPrivateApiCommunity>,
  density: number,
  pinnedColumnns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>,
) {
  const validRowHeight = getValidRowHeight(
    props.rowHeight,
    DATA_GRID_PROPS_DEFAULT_VALUES.rowHeight,
    rowHeightWarning,
  );

  return {
    rowHeight: Math.floor(validRowHeight * density),
    headerHeight: Math.floor(props.columnHeaderHeight * density),
    groupHeaderHeight: Math.floor(
      (props.columnGroupHeaderHeight ?? props.columnHeaderHeight) * density,
    ),
    headerFilterHeight: Math.floor(
      (props.headerFilterHeight ?? props.columnHeaderHeight) * density,
    ),
    columnsTotalWidth: columnsTotalWidthSelector(apiRef),
    headersTotalHeight: getTotalHeaderHeight(apiRef, props),
    leftPinnedWidth: pinnedColumnns.left.reduce((w, col) => w + col.computedWidth, 0),
    rightPinnedWidth: pinnedColumnns.right.reduce((w, col) => w + col.computedWidth, 0),
  };
}

function areElementSizesEqual(a: ElementSize, b: ElementSize) {
  return a.width === b.width && a.height === b.height;
}
