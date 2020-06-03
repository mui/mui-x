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
      const scrollBarSize = { y: hasScrollY ? options.scrollbarSize : 0, x: hasScrollX ? options.scrollbarSize : 0 };
      const viewportSize = {
        width: windowSizesRef.current!.width - scrollBarSize.y,
        height: windowSizesRef.current!.height - scrollBarSize.x,
      };

      const viewportPageSize = Math.floor(viewportSize.height / rowHeight);
      const rzPageSize = viewportPageSize * 2; //we multiply by 2 for virtualisation
      const viewportMaxPage = Math.ceil(rowsCount / viewportPageSize);

      logger.debug(
        `viewportPageSize:  ${viewportPageSize}, rzPageSize: ${rzPageSize}, viewportMaxPage: ${viewportMaxPage}`,
      );
      const renderingZoneHeight = rzPageSize * rowHeight + rowHeight + scrollBarSize.x;
      const dataContainerWidth = columnsTotalWidth - scrollBarSize.y;
      const totalHeight = (rowsCount / viewportPageSize) * viewportSize.height + scrollBarSize.x;

      const indexes: ContainerProps = {
        renderingZonePageSize: rzPageSize,
        viewportPageSize,
        hasScrollY,
        hasScrollX,
        scrollBarSize: options.scrollbarSize,
        totalSizes: {
          width: columnsTotalWidth,
          height: totalHeight || 1,
        },
        dataContainerSizes: {
          width: dataContainerWidth,
          height: totalHeight || 1,
        },
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
    [windowRef, logger],
  );

  return getContainerProps;
};
