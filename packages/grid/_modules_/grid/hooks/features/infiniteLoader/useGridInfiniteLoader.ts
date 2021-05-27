import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import {
  GRID_FILTER_MODEL_CHANGE,
  GRID_ROWS_SCROLL,
  GRID_ROWS_SCROLL_END,
  GRID_SORT_MODEL_CHANGE,
  GRID_VIRTUAL_PAGE_CHANGE,
} from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridVirtualPageChangeParams } from '../../../models/params/gridVirtualPageChangeParams';
import { GridSortModelParams } from '../../../models/params/gridSortModelParams';
import { GridFilterModelParams } from '../../../models/params/gridFilterModelParams';
import { useLogger } from '../../utils/useLogger';
import { renderStateSelector } from '../virtualization/renderingStateSelector';
import { unorderedGridRowIdsSelector } from '../rows/gridRowsSelector';
import { gridSortModelSelector } from '../sorting/gridSortingSelector';
import { filterGridStateSelector } from '../filter/gridFilterSelector';
import { GridGetRowsReturnValue } from '../../../models/params/gridGetRowsParams';

export const useGridInfiniteLoader = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridInfiniteLoader');
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const renderState = useGridSelector(apiRef, renderStateSelector);
  const allRows = useGridSelector(apiRef, unorderedGridRowIdsSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const filterState = useGridSelector(apiRef, filterGridStateSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleGridScroll = React.useCallback(() => {
    logger.debug('Checking if scroll position reached bottom');

    if (!containerSizes) {
      return;
    }

    const scrollPosition = apiRef.current.getScrollPosition();

    const scrollPositionBottom =
      scrollPosition.top + containerSizes.windowSizes.height + options.scrollEndThreshold;

    if (scrollPositionBottom < containerSizes.dataContainerSizes.height) {
      isInScrollBottomArea.current = false;
    }

    if (
      scrollPositionBottom >= containerSizes.dataContainerSizes.height &&
      !isInScrollBottomArea.current &&
      !options.rowCount
    ) {
      const rowScrollEndParam: GridRowScrollEndParams = {
        api: apiRef,
        visibleColumns,
        viewportPageSize: containerSizes.viewportPageSize,
        virtualRowsCount: containerSizes.virtualRowsCount,
      };
      apiRef.current.publishEvent(GRID_ROWS_SCROLL_END, rowScrollEndParam);
      isInScrollBottomArea.current = true;
    }
  }, [logger, options, containerSizes, apiRef, visibleColumns]);

  const handleGridVirtualPageChange = React.useCallback(
    (params: GridVirtualPageChangeParams) => {
      logger.debug('Virtual page changed');
      if (!containerSizes || !options.getRows) {
        return;
      }

      let nextPage = params.nextPage;

      if (
        params.nextPage > params.currentPage &&
        params.nextPage !== renderState.renderedSizes!.lastPage
      ) {
        nextPage = params.nextPage + 1;
      }

      const newRowsBatchStartIndex = nextPage * containerSizes.viewportPageSize;
      const toBeLoadedRange: any = [...allRows].splice(
        newRowsBatchStartIndex,
        containerSizes.viewportPageSize,
      );

      if (!toBeLoadedRange.includes(null)) {
        return;
      }

      const { rows }: GridGetRowsReturnValue = options.getRows({
        startIndex: newRowsBatchStartIndex,
        viewportPageSize: containerSizes.viewportPageSize,
        sortModel,
        filterModel: filterState,
        api: apiRef,
      });

      if (rows.length) {
        apiRef.current.loadRows(newRowsBatchStartIndex, containerSizes.viewportPageSize, rows);
      }
    },
    [logger, options, renderState, allRows, sortModel, containerSizes, filterState, apiRef],
  );

  const handleGridSortModelChange = React.useCallback(
    (params: GridSortModelParams) => {
      logger.debug('Sort model changed');

      if (!containerSizes || !options.getRows) {
        return;
      }

      const newRowsBatchStartIndex = renderState.virtualPage * containerSizes.viewportPageSize;
      const { rows, rowCount }: GridGetRowsReturnValue = options.getRows({
        startIndex: newRowsBatchStartIndex,
        viewportPageSize: containerSizes.viewportPageSize,
        sortModel: params.sortModel,
        filterModel: filterState,
        api: apiRef,
      });

      if (rows.length) {
        apiRef.current.loadRows(
          newRowsBatchStartIndex,
          containerSizes.viewportPageSize,
          rows,
          rowCount,
        );
      }
    },
    [logger, options, renderState, containerSizes, filterState, apiRef],
  );

  const handleGridFilterModelChange = React.useCallback(
    (params: GridFilterModelParams) => {
      logger.debug('Filter model changed');
      if (!containerSizes || !options.getRows) {
        return;
      }

      const newRowsBatchStartIndex = renderState.virtualPage * containerSizes.viewportPageSize;
      const { rows, rowCount }: GridGetRowsReturnValue = options.getRows({
        startIndex: newRowsBatchStartIndex,
        viewportPageSize: containerSizes.viewportPageSize,
        sortModel,
        filterModel: params.filterModel,
        api: apiRef,
      });

      if (rows.length) {
        apiRef.current.loadRows(
          newRowsBatchStartIndex,
          containerSizes.viewportPageSize,
          rows,
          rowCount,
        );
      }
    },
    [logger, options, containerSizes, sortModel, renderState, apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL, handleGridScroll);
  useGridApiEventHandler(apiRef, GRID_VIRTUAL_PAGE_CHANGE, handleGridVirtualPageChange);
  useGridApiEventHandler(apiRef, GRID_SORT_MODEL_CHANGE, handleGridSortModelChange);
  useGridApiEventHandler(apiRef, GRID_FILTER_MODEL_CHANGE, handleGridFilterModelChange);
  useGridApiOptionHandler(apiRef, GRID_ROWS_SCROLL_END, options.onRowsScrollEnd);
};
