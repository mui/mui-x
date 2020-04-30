import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ContainerProps, GridOptions, InternalColumns, RenderColumnsProps } from '../../models';
import { useLogger } from '../utils/useLogger';

type UpdateRenderedColsFnType = (containerProps: ContainerProps | null, scrollLeft: number) => boolean;
type UseVirtualColumnsReturnType = [React.MutableRefObject<RenderColumnsProps | null>, UpdateRenderedColsFnType];

export const useVirtualColumns = (
  internalColumns: InternalColumns,
  options: GridOptions,
): UseVirtualColumnsReturnType => {
  const logger = useLogger('useVirtualColumns');
  const renderedColRef = useRef<RenderColumnsProps | null>(null);
  const lastScrollLeftRef = useRef<number>(0);

  const reversedPosition = useMemo(() => {
    return [...internalColumns.meta.positions].reverse();
  }, [internalColumns]);

  const getColumnIdxFromScroll = useCallback(
    (left: number) => {
      if (!internalColumns.hasColumns) {
        return -1;
      }
      let colIdx = reversedPosition.findIndex(p => left >= p);
      colIdx = internalColumns.meta.positions.length - 1 - colIdx;
      return colIdx;
    },
    [internalColumns],
  );
  const getColumnFromScroll = useCallback(
    (left: number) => {
      if (!internalColumns.hasColumns) {
        return null;
      }
      return internalColumns.visible[getColumnIdxFromScroll(left)];
    },
    [internalColumns],
  );

  const updateRenderedCols: UpdateRenderedColsFnType = (containerProps: ContainerProps | null, scrollLeft: number) => {
    if (!containerProps || !internalColumns.hasColumns) {
      return false;
    }
    const windowWidth = containerProps.windowSizes.width;
    lastScrollLeftRef.current = scrollLeft;
    logger.debug('first column displayed: ', getColumnFromScroll(scrollLeft)?.headerName);
    logger.debug('last column displayed: ', getColumnFromScroll(scrollLeft + windowWidth)?.headerName);
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
    logger.debug('DIFF last => ', diffLast);
    logger.debug('DIFF first => ', diffFirst);
    const renderNewColState = diffLast > tolerance || diffFirst > tolerance;
    logger.debug('RENDER NEW COL STATE ----> ', renderNewColState);

    if (!renderedColRef || !renderedColRef.current || renderNewColState) {
      const newRenderedColState: RenderColumnsProps = {
        firstColIdx: firstDisplayedIdx - columnBuffer >= 0 ? firstDisplayedIdx - columnBuffer : 0,
        lastColIdx:
          lastDisplayedIdx + columnBuffer >= internalColumns.visible.length - 1
            ? internalColumns.visible.length - 1
            : lastDisplayedIdx + columnBuffer,
        left: 0,
        rightEmptyWidth: 0,
      };
      newRenderedColState.left = internalColumns.meta.positions[newRenderedColState.firstColIdx];
      if (containerProps.hasScrollX) {
        newRenderedColState.rightEmptyWidth =
          internalColumns.meta.totalWidth -
          internalColumns.meta.positions[newRenderedColState.lastColIdx] -
          internalColumns.visible[newRenderedColState.lastColIdx].width!;
      } else if (options.extendRowFullWidth) {
        newRenderedColState.rightEmptyWidth = containerProps.viewportSize.width - internalColumns.meta.totalWidth;
      }
      renderedColRef.current = newRenderedColState;
      logger.debug('New columns state to ', newRenderedColState);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    renderedColRef.current = null;
  }, [internalColumns, options]);

  return [renderedColRef, updateRenderedCols];
};
