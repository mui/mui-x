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

      let hasScrollY: boolean;
      if(options.pagination && options.paginationAutoPageSize) {
        hasScrollY = false;
      } else {
        hasScrollY = windowSizesRef.current.height < (options.pagination && options.paginationPageSize ? options.paginationPageSize * rowHeight : rowsCount * rowHeight);
      }

      const hasScrollX = columnsTotalWidth > windowSizesRef.current.width
      const scrollBarSize = {y: hasScrollY ? options.scrollbarSize : 0, x: hasScrollX ? options.scrollbarSize : 0} ;
      const viewportSize = {
        width: windowSizesRef.current!.width - scrollBarSize.y,
        height: windowSizesRef.current!.height - scrollBarSize.x,
      };
      const viewportAutoPageSize = Math.floor(viewportSize.height / rowHeight);
      let viewportPageSize = viewportAutoPageSize;
      if(options.pagination && options.paginationPageSize) {
        viewportPageSize = options.paginationPageSize;
        viewportSize.height = options.paginationPageSize * rowHeight;
      }

      const rzPageSize = options.pagination ? viewportPageSize : viewportPageSize * 2; //we multiply by 2 for virtualisation
      const viewportMaxPage = Math.ceil(rowsCount / viewportPageSize);

      logger.debug(
        `viewportPageSize:  ${viewportPageSize}, rzPageSize: ${rzPageSize}, viewportMaxPage: ${viewportMaxPage}`,
      );
      const renderingZoneHeight = options.pagination ? viewportSize.height : rzPageSize * rowHeight + rowHeight;
      const dataContainerWidth = columnsTotalWidth - scrollBarSize.y;

      const totalHeight = options.pagination ? renderingZoneHeight : (rowsCount / viewportPageSize) * viewportSize.height + scrollBarSize.x;

      const indexes: ContainerProps = {
        renderingZonePageSize: rzPageSize,
        viewportPageSize: viewportPageSize,
        viewportAutoPageSize,
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
    [windowRef],
  );

  return getContainerProps;
};
