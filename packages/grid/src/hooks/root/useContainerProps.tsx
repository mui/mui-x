import React, { useCallback, useMemo, useRef } from 'react';
import { ContainerProps, ElementSize, GridOptions } from '../../models';
import { useLogger } from '../utils/useLogger';

type ReturnType = (columnsTotalWidth: number, rowsCount: number) => ContainerProps | null; //[ContainerProps | null, () => void];

export const useContainerProps = (windowRef: React.RefObject<HTMLDivElement>, options: GridOptions): ReturnType => {
  const logger = useLogger('useContainerProps');
  const windowSizesRef = useRef<ElementSize>({ width: 0, height: 0 });

  const scrollBarSize = useMemo<number>(() => {
    //TODO dynamic scrollbar size? perf issue?
    return options.scrollbarSize;
  }, [options]);

  const getContainerProps = useCallback(
    (columnsTotalWidth: number, rowsCount: number): ContainerProps | null => {
      if (!windowRef || !windowRef.current) {
        return null;
      }

      logger.debug('Calculating container sizes.');
      const window = windowRef.current.getBoundingClientRect();
      windowSizesRef.current = { width: window.width, height: window.height };
      logger.debug(`window Size - W: ${windowSizesRef.current.width} H: ${windowSizesRef.current.height} `);

      const rowHeight = options.rowHeight;
      const hasScrollY = windowSizesRef.current.height < rowsCount * rowHeight;
      const hasScrollX = columnsTotalWidth > windowSizesRef.current.width;

      const windowPageSize = Math.floor((windowSizesRef.current.height - scrollBarSize) / rowHeight) - 1; //nb ligne in viewport
      const pageSize = windowPageSize * 2; //nb ligne in rendering zone
      const maxPage = Math.floor(rowsCount / windowPageSize);
      logger.debug(`windowPageSize:  ${windowPageSize} - PageSize: ${pageSize} - MaxPage: ${maxPage}`);
      const renderingZoneHeight = (pageSize + 1) * rowHeight + (hasScrollX ? scrollBarSize : 0); //columns + scrollbar
      const dataContainerWidth = columnsTotalWidth - (hasScrollY ? scrollBarSize : 0);
      // const renderingZoneWidth = dataContainerWidth - (hasScrollY ? scrollBarSize : 0);
      logger.debug('columnsTotalWidth ', columnsTotalWidth);
      const lastPage = maxPage - 1 > 0 ? maxPage - 1 : 0;
      const totalHeight = maxPage > 1 ? maxPage * (renderingZoneHeight / 2) : rowsCount * rowHeight;

      const indexes: ContainerProps = {
        pageSize,
        windowPageSize,
        hasScrollY,
        hasScrollX,
        scrollBarSize,
        totalWidth: dataContainerWidth, //internalColumns.meta.totalWidth,
        totalHeight: totalHeight || 1, //min 1px if no rows
        renderingZone: {
          width: dataContainerWidth,
          height: renderingZoneHeight,
        },
        windowSizes: windowSizesRef.current,
        viewportSize: {
          width: windowSizesRef.current!.width - (hasScrollY ? scrollBarSize : 0),
          height: windowSizesRef.current!.height - (hasScrollX ? scrollBarSize : 0),
        },
        lastPage,
      };

      logger.debug('returning container props', indexes);
      return indexes;
    },
    [windowRef],
  );

  return getContainerProps;
};
