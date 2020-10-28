import * as React from 'react';
import { RESIZE } from '../../constants/eventsConstants';
import { ApiRef } from '../../models/api/apiRef';
import { ContainerProps } from '../../models/containerProps';
import { ElementSize } from '../../models/elementSize';
import { isEqual } from '../../utils/utils';
import { columnsTotalWidthSelector } from '../features/columns/columnsSelector';
import { useGridSelector } from '../features/core/useGridSelector';
import { useGridState } from '../features/core/useGridState';
import { PaginationState } from '../features/pagination/paginationReducer';
import { paginationSelector } from '../features/pagination/paginationSelector';
import { rowCountSelector } from '../features/rows/rowsSelector';
import { useLogger } from '../utils/useLogger';
import { optionsSelector } from '../utils/useOptionsProp';
import { useApiEventHandler } from './useApiEventHandler';

export const useContainerProps = (windowRef: React.RefObject<HTMLDivElement>, apiRef: ApiRef) => {
  const logger = useLogger('useContainerProps');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const windowSizesRef = React.useRef<ElementSize>({ width: 0, height: 0 });

  const options = useGridSelector(apiRef, optionsSelector);
  const columnsTotalWidth = useGridSelector(apiRef, columnsTotalWidthSelector);
  const totalRowsCount = useGridSelector(apiRef, rowCountSelector);
  const paginationState = useGridSelector<PaginationState>(apiRef, paginationSelector);

  const getVirtualRowCount = React.useCallback(() => {
    const currentPage = paginationState.page;
    let pageRowCount =
      options.pagination && paginationState.pageSize ? paginationState.pageSize : null;

    pageRowCount =
      !pageRowCount || currentPage * pageRowCount <= totalRowsCount
        ? pageRowCount
        : totalRowsCount - (currentPage - 1) * pageRowCount;

    const virtRowsCount =
      pageRowCount == null || pageRowCount > totalRowsCount ? totalRowsCount : pageRowCount;

    return virtRowsCount;
  }, [options.pagination, paginationState.page, paginationState.pageSize, totalRowsCount]);

  const getContainerProps = React.useCallback((): ContainerProps | null => {
    if (
      !windowRef ||
      !windowRef.current ||
      columnsTotalWidth === 0 ||
      Number.isNaN(columnsTotalWidth)
    ) {
      return null;
    }

    logger.debug('Calculating container sizes.');
    const window = windowRef.current.getBoundingClientRect();
    windowSizesRef.current = { width: window.width, height: window.height };
    logger.debug(
      `window Size - W: ${windowSizesRef.current.width} H: ${windowSizesRef.current.height} `,
    );

    const rowsCount = getVirtualRowCount();
    const rowHeight = options.rowHeight;
    const hasScrollY =
      options.autoPageSize || options.autoHeight
        ? false
        : windowSizesRef.current.height < rowsCount * rowHeight;
    const hasScrollX = columnsTotalWidth > windowSizesRef.current.width;
    const scrollBarSize = {
      y: hasScrollY ? options.scrollbarSize : 0,
      x: hasScrollX ? options.scrollbarSize : 0,
    };
    const viewportSize = {
      width: windowSizesRef.current!.width - scrollBarSize.y,
      height: options.autoHeight
        ? rowsCount * rowHeight
        : windowSizesRef.current!.height - scrollBarSize.x,
    };

    let viewportPageSize = viewportSize.height / rowHeight;
    viewportPageSize = options.pagination
      ? Math.floor(viewportPageSize)
      : Math.round(viewportPageSize);

    // We multiply by 2 for virtualization
    // TODO allow buffer with fixed nb rows
    const rzPageSize = viewportPageSize * 2;
    const viewportMaxPage = options.autoPageSize ? 1 : Math.ceil(rowsCount / viewportPageSize);

    logger.debug(
      `viewportPageSize:  ${viewportPageSize}, rzPageSize: ${rzPageSize}, viewportMaxPage: ${viewportMaxPage}`,
    );
    const renderingZoneHeight = rzPageSize * rowHeight + rowHeight + scrollBarSize.x;
    const dataContainerWidth = columnsTotalWidth - scrollBarSize.y;
    let totalHeight =
      (options.autoPageSize ? 1 : rowsCount / viewportPageSize) * viewportSize.height +
      (hasScrollY ? scrollBarSize.x : 0);

    if (options.autoHeight) {
      totalHeight = rowsCount * rowHeight + scrollBarSize.x;
    }

    const indexes: ContainerProps = {
      virtualRowsCount: options.autoPageSize ? viewportPageSize : rowsCount,
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
  }, [
    windowRef,
    logger,
    getVirtualRowCount,
    options.rowHeight,
    options.autoPageSize,
    options.autoHeight,
    options.scrollbarSize,
    options.pagination,
    columnsTotalWidth,
  ]);

  const updateContainerState = React.useCallback(
    (containerState: ContainerProps | null) => {
      setGridState((state) => {
        if (!isEqual(state.containerSizes, containerState)) {
          state.containerSizes = containerState;
          forceUpdate();
        }
        return state;
      });
    },
    [forceUpdate, setGridState],
  );

  const refreshContainerSizes = React.useCallback(() => {
    const containerProps = getContainerProps();
    updateContainerState(containerProps);
  }, [getContainerProps, updateContainerState]);

  React.useEffect(() => {
    refreshContainerSizes();
  }, [gridState.options.hideFooter, refreshContainerSizes]);

  React.useEffect(() => {
    refreshContainerSizes();
  }, [gridState.columns, refreshContainerSizes]);

  useApiEventHandler(apiRef, RESIZE, refreshContainerSizes);
};
