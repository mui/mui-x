import * as React from 'react';
import { useForkRef } from '@mui/material/utils';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  visibleGridColumnsSelector,
  gridColumnsMetaSelector,
} from '../columns/gridColumnsSelector';
import {
  gridTabIndexColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridFocusColumnHeaderSelector,
} from '../focus/gridFocusStateSelector';
import { gridDensityHeaderHeightSelector } from '../density/densitySelector';
import { gridFilterActiveItemsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../sorting/gridSortingSelector';
import { gridColumnMenuSelector } from '../columnMenu/columnMenuSelector';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';

interface UseGridColumnHeadersProps {
  innerRef?: React.Ref<HTMLDivElement>;
  minColumnIndex?: number;
}

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const { innerRef: innerRefProp, minColumnIndex = 0 } = props;

  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');

  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const rootProps = useGridRootProps();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const handleInnerRef = useForkRef(innerRefProp, innerRef);
  const [renderContext, setRenderContext] = React.useState<GridRenderContext | null>(null);
  const prevRenderContext = React.useRef<GridRenderContext | null>(renderContext);
  const prevScrollLeft = React.useRef(0);

  React.useEffect(() => {
    apiRef.current.columnHeadersContainerElementRef!.current!.scrollLeft = 0;
  }, [apiRef]);

  const updateInnerPosition = React.useCallback(
    (nextRenderContext: GridRenderContext) => {
      const firstColumnToRender = Math.max(
        nextRenderContext!.firstColumnIndex - rootProps.columnBuffer,
        minColumnIndex,
      );

      const offset =
        firstColumnToRender > 0
          ? prevScrollLeft.current - columnsMeta.positions[firstColumnToRender]
          : prevScrollLeft.current;

      innerRef!.current!.style.transform = `translate3d(${-offset}px, 0px, 0px)`;
    },
    [columnsMeta.positions, minColumnIndex, rootProps.columnBuffer],
  );

  const handleScroll = React.useCallback<GridEventListener<GridEvents.rowsScroll>>(
    ({ left, renderContext: nextRenderContext = null }) => {
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

      if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
        setRenderContext(nextRenderContext);
        prevRenderContext.current = nextRenderContext;
      }

      // Pass directly the render context to avoid waiting for the next render
      if (nextRenderContext) {
        updateInnerPosition(nextRenderContext);
      }
    },
    [updateInnerPosition],
  );

  const handleColumnResizeStart = React.useCallback<
    GridEventListener<GridEvents.columnResizeStart>
  >((params) => setResizeCol(params.field), []);
  const handleColumnResizeStop = React.useCallback<GridEventListener<GridEvents.columnResizeStop>>(
    () => setResizeCol(''),
    [],
  );

  const handleColumnReorderStart = React.useCallback<
    GridEventListener<GridEvents.columnHeaderDragStart>
  >((params) => setDragCol(params.field), []);

  const handleColumnReorderStop = React.useCallback<
    GridEventListener<GridEvents.columnHeaderDragEnd>
  >(() => setDragCol(''), []);

  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, handleColumnResizeStart);
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStop, handleColumnResizeStop);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, handleColumnReorderStart);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnd, handleColumnReorderStop);

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleScroll);

  const getColumns = (
    params?: {
      renderContext: GridRenderContext | null;
      minFirstColumn?: number;
      maxLastColumn?: number;
    },
    other = {},
  ) => {
    const {
      renderContext: nextRenderContext = renderContext,
      minFirstColumn = minColumnIndex,
      maxLastColumn = visibleColumns.length,
    } = params || {};

    if (!nextRenderContext) {
      return null;
    }

    const columns: JSX.Element[] = [];

    const firstColumnToRender = Math.max(
      nextRenderContext!.firstColumnIndex! - rootProps.columnBuffer,
      minFirstColumn,
    );

    const lastColumnToRender = Math.min(
      nextRenderContext.lastColumnIndex! + rootProps.columnBuffer,
      maxLastColumn,
    );

    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);

    for (let i = 0; i < renderedColumns.length; i += 1) {
      const column = renderedColumns[i];

      const columnIndex = firstColumnToRender + i;
      const isFirstColumn = columnIndex === 0;
      const hasTabbableElement = !(tabIndexState === null && cellTabIndexState === null);
      const tabIndex =
        (tabIndexState !== null && tabIndexState.field === column.field) ||
        (isFirstColumn && !hasTabbableElement)
          ? 0
          : -1;
      const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === column.field;
      const open = columnMenuState.open && columnMenuState.field === column.field;

      columns.push(
        <GridColumnHeaderItem
          key={i}
          {...sortColumnLookup[column.field]}
          columnMenuOpen={open}
          filterItemsCounter={
            filterColumnLookup[column.field] && filterColumnLookup[column.field].length
          }
          headerHeight={headerHeight}
          isDragging={column.field === dragCol}
          column={column}
          colIndex={columnIndex}
          isResizing={resizeCol === column.field}
          isLastColumn={columnIndex === columns.length - 1}
          extendRowFullWidth={!rootProps.disableExtendRowFullWidth}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          {...other}
        />,
      );
    }

    return columns;
  };

  const rootStyle = {
    minHeight: headerHeight,
    maxHeight: headerHeight,
    lineHeight: `${headerHeight}px`,
  };

  return {
    renderContext,
    getColumns,
    isDragging: !!dragCol,
    updateInnerPosition,
    getRootProps: (other = {}) => ({ style: rootStyle, ...other }),
    getInnerProps: () => ({ ref: handleInnerRef, 'aria-rowindex': 1, role: 'row' }),
  };
};
