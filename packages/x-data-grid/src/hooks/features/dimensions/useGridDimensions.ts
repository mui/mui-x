'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useStoreEffect } from '@mui/x-internals/store';
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
import { getValidRowHeight, rowHeightWarning } from '../rows/gridRowsUtils';
import { getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { DATA_GRID_PROPS_DEFAULT_VALUES } from '../../../constants/dataGridPropsDefaultValues';
import { roundToDecimalPlaces } from '../../../utils/roundToDecimalPlaces';
import { isJSDOM } from '../../../utils/isJSDOM';

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
  autoHeight: false,
  minimalContentHeight: undefined,
};

export const dimensionsStateInitializer: GridStateInitializer<
  Pick<
    DataGridProcessedProps,
    'rowHeight' | 'columnHeaderHeight' | 'columnGroupHeaderHeight' | 'headerFilterHeight'
  >
> = (state, props, apiRef) => {
  const dimensions = EMPTY_DIMENSIONS;
  const { rowHeight, columnHeaderHeight, columnGroupHeaderHeight, headerFilterHeight } = props;

  const density = gridDensityFactorSelector(apiRef);
  const dimensionsWithStatic = {
    ...dimensions,
    ...getStaticDimensions(
      apiRef,
      density,
      gridVisiblePinnedColumnDefinitionsSelector(apiRef),
      rowHeight,
      columnHeaderHeight,
      columnGroupHeaderHeight,
      headerFilterHeight,
    ),
  };

  apiRef.current.store.state.dimensions = dimensionsWithStatic;

  return {
    ...state,
    dimensions: dimensionsWithStatic,
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

export function useGridDimensions(
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'onResize' | 'autoHeight'>,
) {
  const { onResize, autoHeight } = props;
  const getRootDimensions = React.useCallback(() => gridDimensionsSelector(apiRef), [apiRef]);

  const apiPublic: GridDimensionsApi = {
    getRootDimensions,
  };

  const apiPrivate: GridDimensionsPrivateApi = {
    updateDimensions: () => {
      return apiRef.current.virtualizer.api.updateDimensions();
    },
    getViewportPageSize: () => {
      return apiRef.current.virtualizer.api.getViewportPageSize();
    },
  };

  useGridApiMethod(apiRef, apiPublic, 'public');
  useGridApiMethod(apiRef, apiPrivate, 'private');

  const handleRootMount: GridEventListener<'rootMount'> = (root) => {
    setCSSVariables(root, gridDimensionsSelector(apiRef));
  };

  useGridEventPriority(apiRef, 'rootMount', handleRootMount);
  useGridEventPriority(apiRef, 'debouncedResize', onResize);

  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable react-hooks/rules-of-hooks */
    const logger = useGridLogger(apiRef, 'useResizeContainer');
    const errorShown = React.useRef(false);

    useGridEventPriority(apiRef, 'resize', (size) => {
      if (!getRootDimensions().isReady) {
        return;
      }
      if (size.height === 0 && !errorShown.current && !autoHeight && !isJSDOM) {
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
    });
    /* eslint-enable react-hooks/rules-of-hooks */
  }

  useStoreEffect(
    apiRef.current.store,
    (s) => s.dimensions,
    (previous, next) => {
      if (!next.isReady) {
        return;
      }

      if (apiRef.current.rootElementRef.current) {
        setCSSVariables(apiRef.current.rootElementRef.current, next);
      }

      if (!areElementSizesEqual(next.viewportInnerSize, previous.viewportInnerSize)) {
        apiRef.current.publishEvent('viewportInnerSizeChange', next.viewportInnerSize);
      }

      apiRef.current.publishEvent('debouncedResize', next.root);
    },
  );
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
  apiRef: RefObject<GridPrivateApiCommunity>,
  density: number,
  pinnedColumnns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>,
  rowHeight: number,
  columnHeaderHeight: number,
  columnGroupHeaderHeight?: number,
  headerFilterHeight?: number,
) {
  const validRowHeight = getValidRowHeight(
    rowHeight,
    DATA_GRID_PROPS_DEFAULT_VALUES.rowHeight,
    rowHeightWarning,
  );

  return {
    rowHeight: Math.floor(validRowHeight * density),
    headerHeight: Math.floor(columnHeaderHeight * density),
    groupHeaderHeight: Math.floor((columnGroupHeaderHeight ?? columnHeaderHeight) * density),
    headerFilterHeight: Math.floor((headerFilterHeight ?? columnHeaderHeight) * density),
    columnsTotalWidth: columnsTotalWidthSelector(apiRef),
    headersTotalHeight: getTotalHeaderHeight(apiRef, {
      columnHeaderHeight,
      columnGroupHeaderHeight,
      headerFilterHeight,
    }),
    leftPinnedWidth: pinnedColumnns.left.reduce((w, col) => w + col.computedWidth, 0),
    rightPinnedWidth: pinnedColumnns.right.reduce((w, col) => w + col.computedWidth, 0),
  };
}

function areElementSizesEqual(a: ElementSize, b: ElementSize) {
  return a.width === b.width && a.height === b.height;
}
