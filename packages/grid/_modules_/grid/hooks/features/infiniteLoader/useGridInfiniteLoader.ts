import * as React from 'react';
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
import { GridScrollParams } from '../../../models/params/gridScrollParams';

export const useGridInfiniteLoader = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'onRowsScrollEnd' | 'onViewportRowsChange' | 'scrollEndThreshold'
  >,
): void => {
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);
  const renderState = useGridSelector(apiRef, renderStateSelector);
  const previousRenderContext = React.useRef<null | {
    firstRowIndex: number;
    lastRowIndex: number;
  }>(null);

  const handleRowsScrollEnd = React.useCallback(
    (scrollPosition: GridScrollParams) => {
      if (!containerSizes) {
        return;
      }

      const scrollPositionBottom =
        scrollPosition.top + containerSizes.windowSizes.height + props.scrollEndThreshold!;

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
    [apiRef, props.scrollEndThreshold, visibleColumns, containerSizes],
  );

  const handleGridScroll = React.useCallback(() => {
    const scrollPosition = apiRef.current.getScrollPosition();

    handleRowsScrollEnd(scrollPosition);
  }, [apiRef, handleRowsScrollEnd]);

  // TODO: Check if onViewportRowsChange works as expected once virtualization is reworked
  React.useEffect(() => {
    const renderContext = renderState.renderContext!;

    if (!renderContext) {
      return;
    }

    if (
      !previousRenderContext.current ||
      renderContext.firstRowIdx !== previousRenderContext.current.firstRowIndex ||
      renderContext.lastRowIdx !== previousRenderContext.current.lastRowIndex
    ) {
      const viewportRowsChangeParams: GridViewportRowsChangeParams = {
        firstRowIndex: renderContext.firstRowIdx!,
        lastRowIndex: renderContext.lastRowIdx!,
      };
      apiRef.current.publishEvent(GRID_VIEWPORT_ROWS_CHANGE, viewportRowsChangeParams);
    }

    previousRenderContext.current = {
      firstRowIndex: renderContext.firstRowIdx!,
      lastRowIndex: renderContext.lastRowIdx!,
    };
  }, [apiRef, props.onViewportRowsChange, renderState]);

  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL, handleGridScroll);
  useGridApiOptionHandler(apiRef, GRID_ROWS_SCROLL_END, props.onRowsScrollEnd);
  useGridApiOptionHandler(apiRef, GRID_VIEWPORT_ROWS_CHANGE, props.onViewportRowsChange);
};
