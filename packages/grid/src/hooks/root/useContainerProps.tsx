import React, { useCallback, useRef } from 'react';
import { ContainerProps, ElementSize, GridOptions } from '../../models';
import { useLogger } from '../utils/useLogger';

type ReturnType = (options: GridOptions, columnsTotalWidth: number, rowsCount: number) => ContainerProps | null; //[ContainerProps | null, () => void];

export const useContainerProps = (windowRef: React.RefObject<HTMLDivElement>): ReturnType => {
  const logger = useLogger('useContainerProps');
  const windowSizesRef = useRef<ElementSize>({ width: 0, height: 0 });

  const getContainerProps = useCallback(
    (options: GridOptions, columnsTotalWidth: number, rowsCount: number): ContainerProps | null => {
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
      const scrollBarSize = options.scrollbarSize;
      const viewportSize = {
        width: windowSizesRef.current!.width - (hasScrollY ? scrollBarSize : 0),
        height: windowSizesRef.current!.height - (hasScrollX ? scrollBarSize : 0),
      };

      const viewportPageSize = Math.floor(viewportSize.height / rowHeight);
      const rzPageSize = viewportPageSize * 2;
      const viewportMaxPage = Math.ceil(rowsCount / viewportPageSize);

      logger.debug(
        `viewportPageSize:  ${viewportPageSize}, rzPageSize: ${rzPageSize}, viewportMaxPage: ${viewportMaxPage}`,
      );
      const renderingZoneHeight = rzPageSize * rowHeight + rowHeight;
      const dataContainerWidth = columnsTotalWidth - (hasScrollY ? scrollBarSize : 0);

      const totalHeight = (rowsCount / viewportPageSize) * viewportSize.height + (hasScrollX ? scrollBarSize : 0);

      const indexes: ContainerProps = {
        renderingZonePageSize: rzPageSize,
        viewportPageSize: viewportPageSize,
        hasScrollY,
        hasScrollX,
        scrollBarSize,
        totalWidth: dataContainerWidth,
        totalHeight: totalHeight || 1, //min 1px if no rows
        renderingZone: {
          width: dataContainerWidth,
          height: renderingZoneHeight,
        },
        windowSizes: windowSizesRef.current,
        viewportSize,
        lastPage: viewportMaxPage,
      };

      logger.debug('returning container props', indexes);
      return indexes;
    },
    [windowRef],
  );

  return getContainerProps;
};
