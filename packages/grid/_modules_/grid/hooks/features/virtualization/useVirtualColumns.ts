import * as React from 'react';
import {
  ContainerProps,
  GridOptions,
  RenderColumnsProps,
  VirtualizationApi,
  ApiRef,
} from '../../../models/index';
import { isEqual } from '../../../utils/utils';
import { useLogger } from '../../utils/useLogger';
import { COLUMNS_UPDATED, RESIZE } from '../../../constants/eventsConstants';
import { useApiMethod } from '../../root/useApiMethod';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import {
  columnsMetaSelector,
  visibleColumnsLengthSelector,
  visibleColumnsSelector,
} from '../columns/columnsSelector';
import { useGridSelector } from '../core/useGridSelector';

type UpdateRenderedColsFnType = (
  containerProps: ContainerProps | null,
  scrollLeft: number,
) => boolean;
type UseVirtualColumnsReturnType = [
  React.MutableRefObject<RenderColumnsProps | null>,
  UpdateRenderedColsFnType,
];

export const useVirtualColumns = (
  options: GridOptions,
  apiRef: ApiRef,
): UseVirtualColumnsReturnType => {
  const logger = useLogger('useVirtualColumns');

  const renderedColRef = React.useRef<RenderColumnsProps | null>(null);
  const containerPropsRef = React.useRef<ContainerProps | null>(null);
  const lastScrollLeftRef = React.useRef<number>(0);
  const columnsMeta = useGridSelector(apiRef, columnsMetaSelector);
  const visibleColumnCount = useGridSelector(apiRef, visibleColumnsLengthSelector);
  const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);

  const getColumnIdxFromScroll = React.useCallback(
    (left: number) => {
      const positions = columnsMeta.positions;

      if (!visibleColumnCount) {
        return -1;
      }
      let colIdx = [...positions].reverse().findIndex((p) => left >= p);
      colIdx = positions.length - 1 - colIdx;
      return colIdx;
    },
    [columnsMeta.positions, visibleColumnCount],
  );

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
    (containerProps: ContainerProps | null, scrollLeft: number) => {
      if (!containerProps) {
        return false;
      }

      containerPropsRef.current = containerProps;
      const windowWidth = containerProps.windowSizes.width;

      lastScrollLeftRef.current = scrollLeft;
      logger.debug(
        `Columns from ${getColumnFromScroll(scrollLeft)?.field} to ${
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

      const renderNewColState = diffLast > tolerance || diffFirst > tolerance;

      let newRenderedColState: RenderColumnsProps | null = renderedColRef.current;

      if (renderNewColState || newRenderedColState == null) {
        newRenderedColState = {
          leftEmptyWidth: 0,
          rightEmptyWidth: 0,
          firstColIdx: firstDisplayedIdx - columnBuffer >= 0 ? firstDisplayedIdx - columnBuffer : 0,
          lastColIdx:
            lastDisplayedIdx + columnBuffer >= visibleColumns.length - 1
              ? visibleColumns.length - 1
              : lastDisplayedIdx + columnBuffer,
        };
      }
      newRenderedColState.leftEmptyWidth = columnsMeta.positions[newRenderedColState.firstColIdx];
      if (apiRef.current.state.scrollBar.hasScrollX) {
        newRenderedColState.rightEmptyWidth =
          columnsMeta.totalWidth -
          columnsMeta.positions[newRenderedColState.lastColIdx] -
          visibleColumns[newRenderedColState.lastColIdx].width!;
      } else if (!options.disableExtendRowFullWidth) {
        newRenderedColState.rightEmptyWidth =
          apiRef.current.state.viewportSizes.width - columnsMeta.totalWidth;
      }

      if (!isEqual(newRenderedColState, renderedColRef.current)) {
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
  const virtualApi: Partial<VirtualizationApi> = {
    isColumnVisibleInWindow,
  };
  useApiMethod(apiRef, virtualApi, 'ColumnVirtualizationApi');

  const resetRenderedColState = React.useCallback(() => {
    logger.debug('Clearing previous renderedColRef');
    renderedColRef.current = null;
  }, [logger, renderedColRef]);

  useApiEventHandler(apiRef, COLUMNS_UPDATED, resetRenderedColState);
  useApiEventHandler(apiRef, RESIZE, resetRenderedColState);

  return [renderedColRef, updateRenderedCols];
};
