import * as React from 'react';
import { useForkRef } from '@mui/material/utils';
import styled from '@mui/styles/styled';
import clsx from 'clsx';
import {
  visibleGridColumnsSelector,
  gridColumnsMetaSelector,
} from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridDensityHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { gridScrollBarSizeSelector } from '../../hooks/features/container/gridContainerSizesSelector';
import { getDataGridUtilityClass } from '../../gridClasses';
import { composeClasses } from '../../utils/material-ui-utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { useGridApiEventHandler } from '../../hooks/utils/useGridApiEventHandler';
import { GridEvents } from '../../constants/eventsConstants';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';
import { RenderContext } from '../GridVirtualScroller';
import { GridColumnHeaderItem } from './GridColumnHeaderItem';
import { filterGridColumnLookupSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridColumnMenuSelector } from '../../hooks/features/columnMenu/columnMenuSelector';
import { gridSortColumnLookupSelector } from '../../hooks/features/sorting/gridSortingSelector';
import {
  gridTabIndexColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridFocusColumnHeaderSelector,
} from '../../hooks/features/focus/gridFocusStateSelector';

type OwnerState = {
  classes?: GridComponentProps['classes'];
  dragCol: string;
};

const Root = styled('div')({
  // TODO give a slot name and replicate structure from main virtualization
  display: 'flex',
  position: 'absolute',
});

const useUtilityClasses = (ownerState: OwnerState) => {
  const { dragCol, classes } = ownerState;

  const slots = {
    wrapper: ['columnHeaderWrapper', dragCol && 'columnHeaderDropZone'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridColumnsHeader = React.forwardRef<HTMLDivElement, any>(function GridColumnsHeader(
  props,
  ref,
) {
  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');

  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const scrollBarState = useGridSelector(apiRef, gridScrollBarSizeSelector);
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const filterColumnLookup = useGridSelector(apiRef, filterGridColumnLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const rootProps = useGridRootProps();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, wrapperRef);
  const [renderContext, setRenderContext] = React.useState<RenderContext | null>(null);
  const prevRenderContext = React.useRef<RenderContext | null>(renderContext);
  const prevScrollLeft = React.useRef(0);
  const [width, setWidth] = React.useState<number>();

  const ownerState = { dragCol, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

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

  const handleScroll = React.useCallback(
    ({ left, renderContext: nextRenderContext }) => {
      if (!wrapperRef.current) {
        return;
      }

      // Ignore vertical scroll.
      // Excepts the first event which sets the previous render context.
      if (prevScrollLeft.current === left && prevRenderContext.current) {
        return;
      }
      prevScrollLeft.current = left;

      if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
        setRenderContext(nextRenderContext);
        prevRenderContext.current = nextRenderContext;

        const firstColumnToRender = Math.max(
          nextRenderContext!.firstColumnIndex - rootProps.columnBuffer,
          0,
        );
        const offset = columnsMeta.positions[firstColumnToRender];
        wrapperRef!.current!.style.transform = `translate3d(${offset}px, 0px, 0px)`;
      }

      apiRef.current.columnHeadersContainerElementRef!.current!.scrollLeft = left;
    },
    [apiRef, columnsMeta.positions, rootProps.columnBuffer],
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
          hasScrollX={scrollBarState.hasScrollX}
          hasScrollY={scrollBarState.hasScrollY}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
        />,
      );
    }

    return columns;
  };

  const updateWidth = React.useCallback(() => {
    const newWidth = Math.max(
      apiRef.current.columnHeadersContainerElementRef?.current?.clientWidth || 0,
      columnsMeta.totalWidth,
    );
    setWidth(newWidth);
  }, [apiRef, columnsMeta.totalWidth]);

  const handleResize = React.useCallback(() => {
    updateWidth();
  }, [updateWidth]);

  useGridApiEventHandler(apiRef, GridEvents.resize, handleResize);

  return (
    <Root style={{ width }}>
      <div
        ref={handleRef}
        className={clsx(classes.wrapper, scrollBarState.hasScrollX && 'scroll')}
        aria-rowindex={1}
        role="row"
      >
        {getColumns()}
      </div>
    </Root>
  );
});
