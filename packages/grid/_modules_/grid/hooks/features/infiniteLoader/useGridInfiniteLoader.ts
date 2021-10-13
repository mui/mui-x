import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../../utils/useGridSelector';
import { GridEvents } from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../container/gridContainerSizesSelector';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridComponentProps } from '../../../GridComponentProps';
import { gridRenderingSelector } from '../virtualization/renderingStateSelector';
import { GridViewportRowsChangeParams } from '../../../models/params/gridViewportRowsChangeParams';
import { GridScrollParams } from '../../../models/params/gridScrollParams';

/**
 * Only available in DataGridPro
 * @requires useGridColumns (state)
 * @requires useGridContainerProps (state)
 * @requires useGridScroll (method
 * @requires useGridVirtualization (state)
 * @requires useGridNoVirtualization (state)
 */
export const useGridInfiniteLoader = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'onRowsScrollEnd' | 'onViewportRowsChange' | 'scrollEndThreshold'
  >,
): void => {
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const renderState = useGridSelector(apiRef, gridRenderingSelector);

  const isInScrollBottomArea = React.useRef<boolean>(false);
  const previousRenderContext = React.useRef<null | {
    firstRowIndex: number;
    lastRowIndex: number;
  }>(null);

  const handleRowsScrollEnd = React.useCallback(
    (scrollPosition: GridScrollParams) => {
      // Exiting if scrollPosition.top === 0 is because this callback is also called on the first render.
      if (!containerSizes || scrollPosition.top === 0) {
        return;
      }

      const scrollPositionBottom =
        scrollPosition.top + containerSizes.windowSizes.height + props.scrollEndThreshold;

      if (scrollPositionBottom < containerSizes.dataContainerSizes.height) {
        isInScrollBottomArea.current = false;
      }

      if (
        scrollPositionBottom >= containerSizes.dataContainerSizes.height &&
        !isInScrollBottomArea.current
      ) {
        const rowScrollEndParam: GridRowScrollEndParams = {
          visibleColumns,
          viewportPageSize: containerSizes.viewportPageSize,
          virtualRowsCount: containerSizes.virtualRowsCount,
        };
        apiRef.current.publishEvent(GridEvents.rowsScrollEnd, rowScrollEndParam);
        isInScrollBottomArea.current = true;
      }
    },
    [apiRef, props.scrollEndThreshold, visibleColumns, containerSizes],
  );

  const handleGridScroll = React.useCallback(
    ({ left, top }) => {
      handleRowsScrollEnd({ left, top });
    },
    [handleRowsScrollEnd],
  );

  // TODO: Check if onViewportRowsChange works as expected once virtualization is reworked
  React.useEffect(() => {
    const renderContext = renderState?.renderContext;

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
      apiRef.current.publishEvent(GridEvents.viewportRowsChange, viewportRowsChangeParams);
    }

    previousRenderContext.current = {
      firstRowIndex: renderContext.firstRowIdx!,
      lastRowIndex: renderContext.lastRowIdx!,
    };
  }, [apiRef, props.onViewportRowsChange, renderState]);

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleGridScroll);
  useGridApiOptionHandler(apiRef, GridEvents.rowsScrollEnd, props.onRowsScrollEnd);
  useGridApiOptionHandler(apiRef, GridEvents.viewportRowsChange, props.onViewportRowsChange);
};
