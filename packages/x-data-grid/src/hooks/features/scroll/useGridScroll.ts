import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridLogger } from '../../utils/useGridLogger';
import {
  gridColumnPositionsSelector,
  gridVisibleColumnDefinitionsSelector,
} from '../columns/gridColumnsSelector';
import { useGridSelector } from '../../utils/useGridSelector';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridPageSelector, gridPageSizeSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridScrollApi } from '../../../models/api/gridScrollApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridExpandedSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { gridDimensionsSelector } from '../dimensions';
import { gridListColumnSelector } from '../listView/gridListViewSelectors';

// Logic copied from https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox.js
// Similar to https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
function scrollIntoView(dimensions: {
  containerSize: number;
  scrollPosition: number;
  elementSize: number;
  elementOffset: number;
}) {
  const { containerSize, scrollPosition, elementSize, elementOffset } = dimensions;

  const elementEnd = elementOffset + elementSize;
  // Always scroll to top when cell is higher than viewport to avoid scroll jump
  // See https://github.com/mui/mui-x/issues/4513 and https://github.com/mui/mui-x/issues/4514
  if (elementSize > containerSize) {
    return elementOffset;
  }
  if (elementEnd - containerSize > scrollPosition) {
    return elementEnd - containerSize;
  }
  if (elementOffset < scrollPosition) {
    return elementOffset;
  }
  return undefined;
}

/**
 * @requires useGridPagination (state) - can be after, async only
 * @requires useGridColumns (state) - can be after, async only
 * @requires useGridRows (state) - can be after, async only
 * @requires useGridRowsMeta (state) - can be after, async only
 * @requires useGridFilter (state)
 * @requires useGridColumnSpanning (method)
 */
export const useGridScroll = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'pagination' | 'unstable_listView'>,
): void => {
  const isRtl = useRtl();
  const logger = useGridLogger(apiRef, 'useGridScroll');
  const colRef = apiRef.current.columnHeadersContainerRef;
  const virtualScrollerRef = apiRef.current.virtualScrollerRef!;
  const visibleSortedRows = useGridSelector(apiRef, gridExpandedSortedRowEntriesSelector);

  const scrollToIndexes = React.useCallback<GridScrollApi['scrollToIndexes']>(
    (params: Partial<GridCellIndexCoordinates>) => {
      const dimensions = gridDimensionsSelector(apiRef.current.state);
      const totalRowCount = gridRowCountSelector(apiRef);
      const visibleColumns = props.unstable_listView
        ? [gridListColumnSelector(apiRef.current.state)!]
        : gridVisibleColumnDefinitionsSelector(apiRef);
      const scrollToHeader = params.rowIndex == null;
      if ((!scrollToHeader && totalRowCount === 0) || visibleColumns.length === 0) {
        return false;
      }

      logger.debug(`Scrolling to cell at row ${params.rowIndex}, col: ${params.colIndex} `);

      let scrollCoordinates: Partial<GridScrollParams> = {};

      if (params.colIndex !== undefined) {
        const columnPositions = gridColumnPositionsSelector(apiRef);

        let cellWidth: number | undefined;

        if (typeof params.rowIndex !== 'undefined') {
          const rowId = visibleSortedRows[params.rowIndex]?.id;
          const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(
            rowId,
            params.colIndex,
          );
          if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
            cellWidth = cellColSpanInfo.cellProps.width;
          }
        }

        if (typeof cellWidth === 'undefined') {
          cellWidth = visibleColumns[params.colIndex].computedWidth;
        }
        // When using RTL, `scrollLeft` becomes negative, so we must ensure that we only compare values.
        scrollCoordinates.left = scrollIntoView({
          containerSize: dimensions.viewportOuterSize.width,
          scrollPosition: Math.abs(virtualScrollerRef.current!.scrollLeft),
          elementSize: cellWidth,
          elementOffset: columnPositions[params.colIndex],
        });
      }
      if (params.rowIndex !== undefined) {
        const rowsMeta = gridRowsMetaSelector(apiRef.current.state);
        const page = gridPageSelector(apiRef);
        const pageSize = gridPageSizeSelector(apiRef);

        const elementIndex = !props.pagination
          ? params.rowIndex
          : params.rowIndex - page * pageSize;

        const targetOffsetHeight = rowsMeta.positions[elementIndex + 1]
          ? rowsMeta.positions[elementIndex + 1] - rowsMeta.positions[elementIndex]
          : rowsMeta.currentPageTotalHeight - rowsMeta.positions[elementIndex];

        scrollCoordinates.top = scrollIntoView({
          containerSize: dimensions.viewportInnerSize.height,
          scrollPosition: virtualScrollerRef.current!.scrollTop,
          elementSize: targetOffsetHeight,
          elementOffset: rowsMeta.positions[elementIndex],
        });
      }

      scrollCoordinates = apiRef.current.unstable_applyPipeProcessors(
        'scrollToIndexes',
        scrollCoordinates,
        params,
      );

      if (
        typeof scrollCoordinates.left !== undefined ||
        typeof scrollCoordinates.top !== undefined
      ) {
        apiRef.current.scroll(scrollCoordinates);
        return true;
      }

      return false;
    },
    [
      logger,
      apiRef,
      virtualScrollerRef,
      props.pagination,
      visibleSortedRows,
      props.unstable_listView,
    ],
  );

  const scroll = React.useCallback<GridScrollApi['scroll']>(
    (params: Partial<GridScrollParams>) => {
      if (virtualScrollerRef.current && params.left !== undefined && colRef.current) {
        const direction = isRtl ? -1 : 1;
        colRef.current.scrollLeft = params.left;
        virtualScrollerRef.current.scrollLeft = direction * params.left;
        logger.debug(`Scrolling left: ${params.left}`);
      }
      if (virtualScrollerRef.current && params.top !== undefined) {
        virtualScrollerRef.current.scrollTop = params.top;
        logger.debug(`Scrolling top: ${params.top}`);
      }
      logger.debug(`Scrolling, updating container, and viewport`);
    },
    [virtualScrollerRef, isRtl, colRef, logger],
  );

  const getScrollPosition = React.useCallback<GridScrollApi['getScrollPosition']>(() => {
    if (!virtualScrollerRef?.current) {
      return { top: 0, left: 0 };
    }
    return {
      top: virtualScrollerRef.current.scrollTop,
      left: virtualScrollerRef.current.scrollLeft,
    };
  }, [virtualScrollerRef]);

  const scrollApi: GridScrollApi = {
    scroll,
    scrollToIndexes,
    getScrollPosition,
  };
  useGridApiMethod(apiRef, scrollApi, 'public');
};
