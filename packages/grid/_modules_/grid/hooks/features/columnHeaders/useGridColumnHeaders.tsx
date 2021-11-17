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
import { RenderContext } from '../virtualization/useGridVirtualScroller';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';

interface UseGridColumnHeadersProps {
  innerRef?: React.Ref<HTMLDivElement>;
}

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const { innerRef: innerRefProp } = props;

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
  const [renderContext, setRenderContext] = React.useState<RenderContext | null>(null);
  const prevRenderContext = React.useRef<RenderContext | null>(renderContext);
  const prevScrollLeft = React.useRef(0);

  const renderedColumns = React.useMemo(() => {
    if (renderContext == null) {
      return [];
    }

    const firstColumnToRender = Math.max(
      renderContext.firstColumnIndex! - rootProps.columnBuffer,
      0,
    );

    const lastColumnToRender = Math.min(
      renderContext.lastColumnIndex! + rootProps.columnBuffer,
      visibleColumns.length,
    );

    return visibleColumns.slice(firstColumnToRender, lastColumnToRender);
  }, [renderContext, rootProps.columnBuffer, visibleColumns]);

  React.useEffect(() => {
    apiRef.current.columnHeadersContainerElementRef!.current!.scrollLeft = 0;
  }, [apiRef]);

  const updateInnerPosition = React.useCallback(
    (nextRenderContext: RenderContext) => {
      const firstColumnToRender = Math.max(
        nextRenderContext!.firstColumnIndex - rootProps.columnBuffer,
        0,
      );

      const offset =
        firstColumnToRender > 0
          ? prevScrollLeft.current - columnsMeta.positions[firstColumnToRender]
          : prevScrollLeft.current;

      innerRef!.current!.style.transform = `translate3d(${-offset}px, 0px, 0px)`;
    },
    [columnsMeta.positions, rootProps.columnBuffer],
  );

  const handleScroll = React.useCallback(
    ({ left, renderContext: nextRenderContext }) => {
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

  const handleColumnResizeStart = React.useCallback(
    (params: { field: string }) => setResizeCol(params.field),
    [],
  );
  const handleColumnResizeStop = React.useCallback(() => setResizeCol(''), []);
  const handleColumnReorderStart = React.useCallback(
    (params: GridColumnHeaderParams) => setDragCol(params.field),
    [],
  );
  const handleColumnReorderStop = React.useCallback(() => setDragCol(''), []);

  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, handleColumnResizeStart);
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStop, handleColumnResizeStop);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, handleColumnReorderStart);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnd, handleColumnReorderStop);

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleScroll);

  const getColumns = () => {
    if (!renderContext) {
      return null;
    }

    const columns: JSX.Element[] = [];

    const firstColumnToRender = Math.max(
      renderContext!.firstColumnIndex! - rootProps.columnBuffer,
      0,
    );

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
    isDragging: !!dragCol,
    getColumns,
    getRootProps: (other = {}) => ({ style: rootStyle, ...other }),
    getInnerProps: () => ({ ref: handleInnerRef, 'aria-rowindex': 1, role: 'row' }),
  };
};
