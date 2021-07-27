import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import {
  GRID_ROWS_SCROLL,
  GRID_ROWS_SCROLL_END,
  GRID_VIEWPORT_ROWS_CHANGE,
} from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridViewportRowsChange } from '../../../models/params/gridViewportRowsChange';

export const useGridInfiniteLoader = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'onRowsScrollEnd' | 'onViewportRowsChange'>,
): void => {
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);
  const totalRowsScrolledHeight = React.useRef<number>(0);
  const lastScrollPosition = React.useRef<GridScrollParams>({ top: 0, left: 0 });
  const firstRowIndex = React.useRef<number>(0);

  const handleRowsScrollEnd = React.useCallback(
    (scrollPosition) => {
      if (!containerSizes) {
        return;
      }

      const scrollPositionBottom =
        scrollPosition.top + containerSizes.windowSizes.height + options.scrollEndThreshold;

      if (scrollPositionBottom < containerSizes.dataContainerSizes.height) {
        isInScrollBottomArea.current = false;
      }

      if (
        scrollPositionBottom >= containerSizes.dataContainerSizes.height &&
        !isInScrollBottomArea.current
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
    },
    [apiRef, options, visibleColumns, containerSizes],
  );

  const handleViewportRowsChange = React.useCallback(
    (scrollPosition) => {
      if (!containerSizes) {
        return;
      }
      const firstPartialRow =
        containerSizes.windowSizes.height - containerSizes.viewportPageSize * options.rowHeight;

      if (
        lastScrollPosition.current.top < scrollPosition.top &&
        firstPartialRow + totalRowsScrolledHeight.current + 1 <= scrollPosition.top
      ) {
        totalRowsScrolledHeight.current += options.rowHeight;
        firstRowIndex.current += 1;
        const viewportRowsChangeParams: GridViewportRowsChange = {
          firstRowIndex: firstRowIndex.current,
          lastRowIndex: containerSizes.viewportPageSize + firstRowIndex.current,
          api: apiRef,
        };
        apiRef.current.publishEvent(GRID_VIEWPORT_ROWS_CHANGE, viewportRowsChangeParams);
      }

      if (
        lastScrollPosition.current.top > scrollPosition.top &&
        totalRowsScrolledHeight.current - firstPartialRow - 1 >= scrollPosition.top
      ) {
        totalRowsScrolledHeight.current -= options.rowHeight;
        firstRowIndex.current -= 1;
        const viewportRowsChangeParams: GridViewportRowsChange = {
          firstRowIndex: firstRowIndex.current,
          lastRowIndex: containerSizes.viewportPageSize + firstRowIndex.current,
          api: apiRef,
        };
        apiRef.current.publishEvent(GRID_VIEWPORT_ROWS_CHANGE, viewportRowsChangeParams);
      }

      lastScrollPosition.current = scrollPosition;
    },
    [apiRef, options, containerSizes],
  );

  const handleGridScroll = React.useCallback(() => {
    if (!props.onRowsScrollEnd && !props.onViewportRowsChange) {
      return;
    }

    const scrollPosition = apiRef.current.getScrollPosition();

    if (props.onViewportRowsChange) {
      handleViewportRowsChange(scrollPosition);
    }
    if (props.onRowsScrollEnd) {
      handleRowsScrollEnd(scrollPosition);
    }
  }, [props, apiRef, handleViewportRowsChange, handleRowsScrollEnd]);

  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL, handleGridScroll);
  useGridApiOptionHandler(apiRef, GRID_ROWS_SCROLL_END, props.onRowsScrollEnd);
  useGridApiOptionHandler(apiRef, GRID_VIEWPORT_ROWS_CHANGE, props.onViewportRowsChange);
};
