import * as React from 'react';
import {
  GridContainerProps,
  GridOptions,
  GridRenderColumnsProps,
  GridVirtualizationApi,
  GridApiRef,
} from '../../../models/index';
import { isDeepEqual } from '../../../utils/utils';
import { useLogger } from '../../utils/useLogger';
import { GRID_COLUMNS_UPDATED, GRID_DEBOUNCED_RESIZE } from '../../../constants/eventsConstants';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import {
  gridColumnsMetaSelector,
  visibleGridColumnsLengthSelector,
  visibleGridColumnsSelector,
} from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';

type UpdateRenderedColsFnType = (
  containerProps: GridContainerProps | null,
  scrollLeft: number,
) => boolean;
type UseVirtualColumnsReturnType = [
  React.MutableRefObject<GridRenderColumnsProps | null>,
  UpdateRenderedColsFnType,
];

export const useGridVirtualColumns = (
  options: GridOptions,
  apiRef: GridApiRef,
): UseVirtualColumnsReturnType => {
  const logger = useLogger('useGridVirtualColumns');

  const renderedColRef = React.useRef<GridRenderColumnsProps | null>(null);
  const containerPropsRef = React.useRef<GridContainerProps | null>(null);
  const lastScrollLeftRef = React.useRef<number>(0);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const visibleColumnCount = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const getColumnIdxFromScroll = React.useMemo(() => {
    // Since we have an ordered list of positions, we can use a binary search
    // to find the intersecting column
    const binSearchColumnIdcFromScroll = (
      offset: number,
      sliceStart = 0,
      sliceEnd = columnsMeta.positions.length,
    ): number => {
      if (!visibleColumnCount) {
        return -1;
      }

      if (sliceStart >= sliceEnd) {
        return sliceStart;
      }

      const pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
      const itemOffset = columnsMeta.positions[pivot];
      return offset <= itemOffset
        ? binSearchColumnIdcFromScroll(offset, sliceStart, pivot)
        : binSearchColumnIdcFromScroll(offset, pivot + 1, sliceEnd);
    };
    return binSearchColumnIdcFromScroll;
  }, [columnsMeta.positions, visibleColumnCount]);

  const getColumnFromScroll = React.useCallback(
    (left: number) => {
      if (!visibleColumns.length) {
        return null;
      }
      return visibleColumns[getColumnIdxFromScroll(left)];
    },
    [getColumnIdxFromScroll, visibleColumns],
  );

  const isColumnVisibleInWindow = React.useCallback(
    (colIndex: number): boolean => {
      if (!containerPropsRef.current) {
        return false;
      }
      const windowWidth = containerPropsRef.current.windowSizes.width;
      const firstCol = getColumnFromScroll(lastScrollLeftRef.current);
      const lastCol = getColumnFromScroll(lastScrollLeftRef.current + windowWidth);

      const firstColIndex = visibleColumns.findIndex((col) => col.field === firstCol?.field) + 1;
      const lastColIndex = visibleColumns.findIndex((col) => col.field === lastCol?.field) - 1; // We ensure the last col is completely visible

      return colIndex >= firstColIndex && colIndex <= lastColIndex;
    },
    [getColumnFromScroll, visibleColumns],
  );

  const updateRenderedCols: UpdateRenderedColsFnType = React.useCallback(
    (containerProps: GridContainerProps | null, scrollLeft: number) => {
      if (!containerProps) {
        return false;
      }

      containerPropsRef.current = containerProps;
      const windowWidth = containerProps.windowSizes.width;

      lastScrollLeftRef.current = scrollLeft;
      logger.debug(
        `GridColumns from ${getColumnFromScroll(scrollLeft)?.field} to ${
          getColumnFromScroll(scrollLeft + windowWidth)?.field
        }`,
      );
      const firstDisplayedIdx = getColumnIdxFromScroll(scrollLeft);
      const lastDisplayedIdx = getColumnIdxFromScroll(scrollLeft + windowWidth);
      const prevFirstColIdx = renderedColRef?.current?.firstColIdx || 0;
      const prevLastColIdx = renderedColRef?.current?.lastColIdx || 0;
      const columnBuffer = options.columnBuffer;
      const tolerance = columnBuffer > 1 ? columnBuffer - 1 : columnBuffer; // Math.floor(columnBuffer / 2);
      const diffFirst = Math.abs(firstDisplayedIdx - tolerance - prevFirstColIdx);
      const diffLast = Math.abs(lastDisplayedIdx + tolerance - prevLastColIdx);
      logger.debug(`Column buffer: ${columnBuffer}, tolerance: ${tolerance}`);
      logger.debug(`Previous values  => first: ${prevFirstColIdx}, last: ${prevLastColIdx}`);
      logger.debug(
        `Current displayed values  => first: ${firstDisplayedIdx}, last: ${lastDisplayedIdx}`,
      );
      logger.debug(`Difference with first: ${diffFirst} and last: ${diffLast} `);

      const lastVisibleColIdx = visibleColumns.length > 0 ? visibleColumns.length - 1 : 0;
      const firstColIdx =
        firstDisplayedIdx - columnBuffer >= 0 ? firstDisplayedIdx - columnBuffer : 0;
      const newRenderedColState = {
        leftEmptyWidth: columnsMeta.positions[firstColIdx],
        rightEmptyWidth: 0,
        firstColIdx,
        lastColIdx:
          lastDisplayedIdx + columnBuffer >= lastVisibleColIdx
            ? lastVisibleColIdx
            : lastDisplayedIdx + columnBuffer,
      };

      if (apiRef.current.state.scrollBar.hasScrollX) {
        newRenderedColState.rightEmptyWidth =
          columnsMeta.totalWidth -
          columnsMeta.positions[newRenderedColState.lastColIdx] -
          visibleColumns[newRenderedColState.lastColIdx].width!;
      } else if (!options.disableExtendRowFullWidth) {
        newRenderedColState.rightEmptyWidth =
          apiRef.current.state.viewportSizes.width - columnsMeta.totalWidth;
      }

      if (!isDeepEqual(newRenderedColState, renderedColRef.current)) {
        renderedColRef.current = newRenderedColState;
        logger.debug('New columns state to render', newRenderedColState);
        return true;
      }
      logger.debug(`No rendering needed on columns`);
      return false;
    },
    [
      logger,
      getColumnFromScroll,
      getColumnIdxFromScroll,
      options.columnBuffer,
      options.disableExtendRowFullWidth,
      visibleColumns,
      columnsMeta.positions,
      columnsMeta.totalWidth,
      apiRef,
    ],
  );
  const virtualApi: Partial<GridVirtualizationApi> = {
    isColumnVisibleInWindow,
  };
  useGridApiMethod(apiRef, virtualApi, 'ColumnVirtualizationApi');

  const resetRenderedColState = React.useCallback(() => {
    logger.debug('Clearing previous renderedColRef');
    renderedColRef.current = null;
  }, [logger, renderedColRef]);

  useGridApiEventHandler(apiRef, GRID_COLUMNS_UPDATED, resetRenderedColState);
  useGridApiEventHandler(apiRef, GRID_DEBOUNCED_RESIZE, resetRenderedColState);

  return [renderedColRef, updateRenderedCols];
};
