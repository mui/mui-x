import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { defaultMemoize } from 'reselect';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  gridVisibleColumnDefinitionsSelector,
  gridColumnPositionsSelector,
} from '../columns/gridColumnsSelector';
import {
  gridTabIndexColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridFocusColumnHeaderSelector,
  unstable_gridTabIndexColumnGroupHeaderSelector,
} from '../focus/gridFocusStateSelector';
import { gridDensityFactorSelector } from '../density/densitySelector';
import { gridFilterActiveItemsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../sorting/gridSortingSelector';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEventListener } from '../../../models/events';
import { GridColumnHeaderFilterItem } from '../../../components/columnHeaders/GridColumnHeaderFilterItem';
import { getFirstColumnIndexToRender, getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { getRenderableIndexes } from '../virtualization/useGridVirtualScroller';

const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (props, styles) => styles.columnHeaderRow,
})(() => ({
  display: 'flex',
}));

interface UseGridColumnHeadersProps {
  innerRef?: React.Ref<HTMLDivElement>;
  minColumnIndex?: number;
}

interface GetHeadersParams {
  renderContext: GridRenderContext | null;
  minFirstColumn?: number;
  maxLastColumn?: number;
}

function isUIEvent(event: any): event is React.UIEvent {
  return !!event.target;
}

export const useGridColumnHeadersFilter = (props: UseGridColumnHeadersProps) => {
  const { innerRef: innerRefProp, minColumnIndex = 0 } = props;

  const apiRef = useGridPrivateApiContext();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const columnHeaderTabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const columnGroupHeaderTabIndexState = useGridSelector(
    apiRef,
    unstable_gridTabIndexColumnGroupHeaderSelector,
  );
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const densityFactor = useGridSelector(apiRef, gridDensityFactorSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const rootProps = useGridRootProps();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const handleInnerRef = useForkRef(innerRefProp, innerRef);
  const [renderContext, setRenderContext] = React.useState<GridRenderContext | null>(null);
  const prevRenderContext = React.useRef<GridRenderContext | null>(renderContext);
  const prevScrollLeft = React.useRef(0);
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, rootProps.columnHeaderHeight);
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);

  React.useEffect(() => {
    apiRef.current.columnHeadersContainerElementRef!.current!.scrollLeft = 0;
  }, [apiRef]);

  // memoize `getFirstColumnIndexToRender`, since it's called on scroll
  const getFirstColumnIndexToRenderRef = React.useRef<typeof getFirstColumnIndexToRender>(
    defaultMemoize(getFirstColumnIndexToRender, {
      equalityCheck: (a, b) =>
        ['firstColumnIndex', 'minColumnIndex', 'columnBuffer'].every((key) => a[key] === b[key]),
    }),
  );

  const updateInnerPosition = React.useCallback(
    (nextRenderContext: GridRenderContext) => {
      const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer,
      });

      const firstColumnToRender = getFirstColumnIndexToRenderRef.current({
        firstColumnIndex: nextRenderContext!.firstColumnIndex,
        minColumnIndex,
        columnBuffer: rootProps.columnBuffer,
        firstRowToRender,
        lastRowToRender,
        apiRef,
        visibleRows: currentPage.rows,
      });

      const offset =
        firstColumnToRender > 0
          ? prevScrollLeft.current - columnPositions[firstColumnToRender]
          : prevScrollLeft.current;

      innerRef!.current!.style.transform = `translate3d(${-offset}px, 0px, 0px)`;
    },
    [
      columnPositions,
      minColumnIndex,
      rootProps.columnBuffer,
      apiRef,
      currentPage.rows,
      rootProps.rowBuffer,
    ],
  );

  const handleScroll = React.useCallback<GridEventListener<'scrollPositionChange'>>(
    ({ left, renderContext: nextRenderContext = null }, event) => {
      if (!innerRef.current) {
        return;
      }

      // Ignore vertical scroll.
      // Excepts the first event which sets the previous render context.
      if (
        prevScrollLeft.current === left &&
        prevRenderContext.current?.firstColumnIndex === nextRenderContext?.firstColumnIndex &&
        prevRenderContext.current?.lastColumnIndex === nextRenderContext?.lastColumnIndex
      ) {
        return;
      }
      prevScrollLeft.current = left;

      // We can only update the position when we guarantee that the render context has been
      // rendered. This is achieved using ReactDOM.flushSync or when the context doesn't change.
      let canUpdateInnerPosition = false;

      if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
        // ReactDOM.flushSync cannot be called on `scroll` events fired inside effects
        if (isUIEvent(event)) {
          // To prevent flickering, the inner position can only be updated after the new context has
          // been rendered. ReactDOM.flushSync ensures that the state changes will happen before
          // updating the position.
          ReactDOM.flushSync(() => {
            setRenderContext(nextRenderContext);
          });
          canUpdateInnerPosition = true;
        } else {
          setRenderContext(nextRenderContext);
        }
        prevRenderContext.current = nextRenderContext;
      } else {
        canUpdateInnerPosition = true;
      }

      // Pass directly the render context to avoid waiting for the next render
      if (nextRenderContext && canUpdateInnerPosition) {
        updateInnerPosition(nextRenderContext);
      }
    },
    [updateInnerPosition],
  );

  useGridApiEventHandler(apiRef, 'scrollPositionChange', handleScroll);

  // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
  const getColumnsToRender = (params?: GetHeadersParams) => {
    const {
      renderContext: nextRenderContext = renderContext,
      minFirstColumn = minColumnIndex,
      maxLastColumn = visibleColumns.length,
    } = params || {};

    if (!nextRenderContext) {
      return null;
    }

    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer,
    });

    const firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext!.firstColumnIndex,
      minColumnIndex: minFirstColumn,
      columnBuffer: rootProps.columnBuffer,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows,
    });

    const lastColumnToRender = Math.min(
      nextRenderContext.lastColumnIndex! + rootProps.columnBuffer,
      maxLastColumn,
    );

    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);

    return {
      renderedColumns,
      firstColumnToRender,
      lastColumnToRender,
      minFirstColumn,
      maxLastColumn,
    };
  };

  const getColumnFilters = (params?: GetHeadersParams, other = {}) => {
    const columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null) {
      return null;
    }

    const { renderedColumns, firstColumnToRender } = columnsToRender;

    const filters: JSX.Element[] = [];
    for (let i = 0; i < renderedColumns.length; i += 1) {
      const colDef = renderedColumns[i];

      const columnIndex = firstColumnToRender + i;
      const isFirstColumn = columnIndex === 0;
      const hasTabbableElement = !(
        columnGroupHeaderTabIndexState === null &&
        columnHeaderTabIndexState === null &&
        cellTabIndexState === null
      );
      const tabIndex =
        (columnHeaderTabIndexState !== null && columnHeaderTabIndexState.field === colDef.field) ||
        (isFirstColumn && !hasTabbableElement)
          ? 0
          : -1;
      const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === colDef.field;

      filters.push(
        <GridColumnHeaderFilterItem
          key={colDef.field}
          {...sortColumnLookup[colDef.field]}
          filterItemsCounter={
            filterColumnLookup[colDef.field] && filterColumnLookup[colDef.field].length
          }
          headerHeight={headerHeight}
          colDef={colDef}
          colIndex={columnIndex}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          {...other}
        />,
      );
    }

    return <GridColumnHeaderRow role="row">{filters}</GridColumnHeaderRow>;
  };

  const rootStyle = {
    minHeight: totalHeaderHeight,
    maxHeight: totalHeaderHeight,
    lineHeight: `${headerHeight}px`,
  };

  return {
    renderContext,
    getColumnFilters,
    getRootProps: (other = {}) => ({ style: rootStyle, ...other }),
    getInnerProps: () => ({
      ref: handleInnerRef,
      role: 'rowgroup',
    }),
  };
};
