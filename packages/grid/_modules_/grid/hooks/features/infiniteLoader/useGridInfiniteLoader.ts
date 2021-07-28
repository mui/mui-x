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
import { renderStateSelector } from '../virtualization/renderingStateSelector';
import { GridViewportRowsChangeParams } from '../../../models/params/gridViewportRowsChangeParams';

export const useGridInfiniteLoader = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'onRowsScrollEnd' | 'onViewportRowsChange'>,
): void => {
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);
  const renderState = useGridSelector(apiRef, renderStateSelector);
  const prevViewport = React.useRef<null | { firstRowIndex: number; lastRowIndex: number }>(null);

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

  React.useEffect(() => {
    const renderContext = renderState.renderContext!;

    if (!props.onViewportRowsChange || !renderContext) {
      return;
    }

    if (
      !prevViewport.current ||
      renderContext.firstRowIdx !== prevViewport.current.firstRowIndex ||
      renderContext.lastRowIdx !== prevViewport.current.lastRowIndex
    ) {
      const viewportRowsChangeParams: GridViewportRowsChangeParams = {
        firstRowIndex: renderContext.firstRowIdx!,
        lastRowIndex: renderContext.lastRowIdx!,
        api: apiRef,
      };
      apiRef.current.publishEvent(GRID_VIEWPORT_ROWS_CHANGE, viewportRowsChangeParams);
    }

    prevViewport.current = {
      firstRowIndex: renderContext.firstRowIdx!,
      lastRowIndex: renderContext.lastRowIdx!,
    };
  }, [apiRef, props.onViewportRowsChange, renderState]);

  const handleGridScroll = React.useCallback(() => {
    if (!props.onRowsScrollEnd && !props.onViewportRowsChange) {
      return;
    }

    const scrollPosition = apiRef.current.getScrollPosition();

    if (props.onRowsScrollEnd) {
      handleRowsScrollEnd(scrollPosition);
    }
  }, [props, apiRef, handleRowsScrollEnd]);

  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL, handleGridScroll);
  useGridApiOptionHandler(apiRef, GRID_ROWS_SCROLL_END, props.onRowsScrollEnd);
  useGridApiOptionHandler(apiRef, GRID_VIEWPORT_ROWS_CHANGE, props.onViewportRowsChange);
};
