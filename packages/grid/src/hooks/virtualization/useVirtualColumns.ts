import React, { useCallback, useEffect, useRef } from 'react';
import {ContainerProps, GridApi, GridOptions, RenderColumnsProps, VirtualizationApi} from '../../models';
import { useLogger } from '../utils/useLogger';
import { GridApiRef } from '../../grid';
import { COLUMNS_UPDATED } from '../../constants/eventsConstants';

type UpdateRenderedColsFnType = (containerProps: ContainerProps | null, scrollLeft: number) => boolean;
type UseVirtualColumnsReturnType = [React.MutableRefObject<RenderColumnsProps | null>, UpdateRenderedColsFnType];

export const useVirtualColumns = (options: GridOptions, apiRef: GridApiRef): UseVirtualColumnsReturnType => {
  const logger = useLogger('useVirtualColumns');
  const renderedColRef = useRef<RenderColumnsProps | null>(null);
  const containerPropsRef = useRef< ContainerProps | null>(null);
  const lastScrollLeftRef = useRef<number>(0);

  const getColumnIdxFromScroll = useCallback(
    (left: number) => {
      const positions = apiRef.current!.getColumnsMeta().positions;
      const hasColumns = apiRef.current!.getVisibleColumns().length;

      if (!hasColumns) {
        return -1;
      }
      let colIdx = [...positions].reverse().findIndex(p => left >= p);
      colIdx = positions.length - 1 - colIdx;
      return colIdx;
    },
    [apiRef],
  );

  const getColumnFromScroll = useCallback(
    (left: number) => {
      const visibleColumns = apiRef.current!.getVisibleColumns();
      if (!visibleColumns.length) {
        return null;
      }
      return visibleColumns[getColumnIdxFromScroll(left)];
    },
    [apiRef],
  );

  const isColumnVisibleInWindow = (colIndex: number): boolean => {
    if(!containerPropsRef.current) {
      return false;
    }
    const windowWidth = containerPropsRef.current.windowSizes.width;
    const firstCol = getColumnFromScroll(lastScrollLeftRef.current);
    const lastCol = getColumnFromScroll(lastScrollLeftRef.current + windowWidth);

    const visibleColumns = apiRef.current!.getVisibleColumns();
    const firstColIndex = visibleColumns.findIndex(col=> col.field === firstCol?.field);
    const lastColIndex = visibleColumns.findIndex(col=> col.field === lastCol?.field) - 1; //We ensure the last col is completely visible

    return colIndex >= firstColIndex && colIndex <= lastColIndex;
  }

  const updateRenderedCols: UpdateRenderedColsFnType = (containerProps: ContainerProps | null, scrollLeft: number) => {
    if (!containerProps) {
      return false;
    }
    containerPropsRef.current = containerProps;
    const visibleColumns = apiRef.current!.getVisibleColumns();
    const columnsMeta = apiRef.current!.getColumnsMeta();
    const windowWidth = containerProps.windowSizes.width;
    lastScrollLeftRef.current = scrollLeft;
    logger.debug(`Columns from ${getColumnFromScroll(scrollLeft)?.headerName} to ${getColumnFromScroll(scrollLeft + windowWidth)?.headerName}` );
    const firstDisplayedIdx = getColumnIdxFromScroll(scrollLeft);
    const lastDisplayedIdx = getColumnIdxFromScroll(scrollLeft + windowWidth);
    const prevFirstColIdx = renderedColRef?.current?.firstColIdx || 0;
    const prevLastColIdx = renderedColRef?.current?.lastColIdx || 0;
    const columnBuffer = options.columnBuffer;
    const tolerance = columnBuffer - 1; //Math.floor(columnBuffer / 2);
    const diffFirst = Math.abs(firstDisplayedIdx - tolerance - prevFirstColIdx);
    const diffLast = Math.abs(lastDisplayedIdx + tolerance - prevLastColIdx);
    logger.debug(`Column buffer: ${columnBuffer}, tolerance: ${tolerance}`);
    logger.debug(`Previous values  => first: ${prevFirstColIdx}, last: ${prevLastColIdx}`);
    logger.debug(`Current displayed values  => first: ${firstDisplayedIdx}, last: ${lastDisplayedIdx}`);
    logger.debug(`Difference with first: ${diffFirst} and last: ${diffLast} `);

    const renderNewColState = diffLast > tolerance || diffFirst > tolerance;

    if (!renderedColRef || !renderedColRef.current || renderNewColState) {
      const newRenderedColState: RenderColumnsProps = {
        firstColIdx: firstDisplayedIdx - columnBuffer >= 0 ? firstDisplayedIdx - columnBuffer : 0,
        lastColIdx:
          lastDisplayedIdx + columnBuffer >= visibleColumns.length - 1
            ? visibleColumns.length - 1
            : lastDisplayedIdx + columnBuffer,
        left: 0,
        rightEmptyWidth: 0,
      };
      newRenderedColState.left = columnsMeta.positions[newRenderedColState.firstColIdx];
      if (containerProps.hasScrollX) {
        newRenderedColState.rightEmptyWidth =
          columnsMeta.totalWidth -
          columnsMeta.positions[newRenderedColState.lastColIdx] -
          visibleColumns[newRenderedColState.lastColIdx].width!;
      } else if (options.extendRowFullWidth) {
        newRenderedColState.rightEmptyWidth = containerProps.viewportSize.width - columnsMeta.totalWidth;
      }
      renderedColRef.current = newRenderedColState;
      logger.debug('New columns state to render', newRenderedColState);
      return true;
    } else {
      logger.debug(`No rendering needed on columns`);
      return false;
    }
  };

  useEffect(() => {
    if (apiRef.current) {
      const handler = () => {
        logger.debug('Clearing previous renderedColRef');
        renderedColRef.current = null;
      };

      logger.debug('Adding scroll api to apiRef');

      const virtualApi: Partial<VirtualizationApi> = {
        isColumnVisibleInWindow,
      };

      apiRef.current = Object.assign(apiRef.current, virtualApi) as GridApi;

      return apiRef.current.registerEvent(COLUMNS_UPDATED, handler);
    }
  }, [apiRef]);

  return [renderedColRef, updateRenderedCols];
};
