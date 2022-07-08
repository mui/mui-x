import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useForkRef } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import { defaultMemoize } from 'reselect';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  gridVisibleColumnDefinitionsSelector,
  gridColumnPositionsSelector,
} from '../columns/gridColumnsSelector';
import {
  gridTabIndexColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridFocusColumnHeaderSelector,
} from '../focus/gridFocusStateSelector';
import {
  gridDensityHeaderHeightSelector,
  gridDensityHeaderGroupingMaxDepthSelector,
  gridDensityHeaderGroupingRowHeightSelector,
  gridDensityTotalHeaderHeightSelector,
} from '../density/densitySelector';
import { gridFilterActiveItemsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../sorting/gridSortingSelector';
import { gridColumnMenuSelector } from '../columnMenu/columnMenuSelector';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEventListener } from '../../../models/events';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { getFirstColumnIndexToRender } from '../columns/gridColumnsUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { getRenderableIndexes } from '../virtualization/useGridVirtualScroller';
import { GridColumnGroupHeader } from '../../../components/columnHeaders/GridColumnGroupHeader';

// TODO: add the possibility to switch this value if needed for customization
const MERGE_EMPTY_CELLS = true;

const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (props, styles) => styles.columnHeaderRow,
})(() => ({
  display: 'flex',
}));

interface HeaderInfo {
  groupId: string | null;
  width: number;
  fields: string[];
  colIndex: number;
  description?: string;
}

interface UseGridColumnHeadersProps {
  innerRef?: React.Ref<HTMLDivElement>;
  minColumnIndex?: number;
}

function isUIEvent(event: any): event is React.UIEvent {
  return !!event.target;
}

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const { innerRef: innerRefProp, minColumnIndex = 0 } = props;

  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');

  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridDensityHeaderGroupingMaxDepthSelector);
  const headerGroupingRowHeight = useGridSelector(
    apiRef,
    gridDensityHeaderGroupingRowHeightSelector,
  );
  const totalHeaderHeight = useGridSelector(apiRef, gridDensityTotalHeaderHeightSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const rootProps = useGridRootProps();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const handleInnerRef = useForkRef(innerRefProp, innerRef);
  const [renderContext, setRenderContext] = React.useState<GridRenderContext | null>(null);
  const prevRenderContext = React.useRef<GridRenderContext | null>(renderContext);
  const prevScrollLeft = React.useRef(0);
  const currentPage = useGridVisibleRows(apiRef, rootProps);

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

  React.useLayoutEffect(() => {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);

  const handleScroll = React.useCallback<GridEventListener<'rowsScroll'>>(
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

  const handleColumnResizeStart = React.useCallback<GridEventListener<'columnResizeStart'>>(
    (params) => setResizeCol(params.field),
    [],
  );
  const handleColumnResizeStop = React.useCallback<GridEventListener<'columnResizeStop'>>(
    () => setResizeCol(''),
    [],
  );

  const handleColumnReorderStart = React.useCallback<GridEventListener<'columnHeaderDragStart'>>(
    (params) => setDragCol(params.field),
    [],
  );

  const handleColumnReorderStop = React.useCallback<GridEventListener<'columnHeaderDragEnd'>>(
    () => setDragCol(''),
    [],
  );

  useGridApiEventHandler(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);

  useGridApiEventHandler(apiRef, 'rowsScroll', handleScroll);

  const getColumnsHeader = (
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
          key={column.field}
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
          isLastColumn={columnIndex === visibleColumns.length - 1}
          extendRowFullWidth={!rootProps.disableExtendRowFullWidth}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          {...other}
        />,
      );
    }

    return (
      <GridColumnHeaderRow role="row" aria-rowindex={headerGroupingMaxDepth + 1}>
        {columns}
      </GridColumnHeaderRow>
    );
  };

  const getColumnsHeaderGroups = (params?: {
    renderContext: GridRenderContext | null;
    minFirstColumn?: number;
    maxLastColumn?: number;
  }) => {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }

    const {
      renderContext: nextRenderContext = renderContext,
      minFirstColumn = minColumnIndex,
      maxLastColumn = visibleColumns.length,
    } = params || {};

    if (!nextRenderContext) {
      return null;
    }

    const columns: JSX.Element[] = [];

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

    const headerToRender: {
      leftOverflow: number;
      elements: HeaderInfo[];
    }[] = [];

    for (let depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      // Initialize the header line with a grouping item containing all the columns on the left of the virtualization which are in the same group as the first group to render
      const initialHeader: HeaderInfo[] = [];
      let leftOverflow = 0;

      let columnIndex = firstColumnToRender - 1;
      const firstColumnToRenderGroup = visibleColumns[firstColumnToRender]?.groupPath?.[depth]!;
      while (
        firstColumnToRenderGroup !== null &&
        columnIndex >= minColumnIndex &&
        visibleColumns[columnIndex]?.groupPath &&
        visibleColumns[columnIndex]?.groupPath?.[depth] === firstColumnToRenderGroup
      ) {
        const column = visibleColumns[columnIndex];

        leftOverflow += column.width ?? 0;

        if (initialHeader.length === 0) {
          initialHeader.push({
            width: column.width ?? 0,
            fields: [column.field],
            groupId: firstColumnToRenderGroup,
            colIndex: columnIndex,
          });
        } else {
          initialHeader[0].width += column.width ?? 0;
          initialHeader[0].fields.push(column.field);
          initialHeader[0].colIndex = columnIndex;
        }

        columnIndex -= 1;
      }

      const depthInfo = renderedColumns.reduce((aggregated, column, i) => {
        const lastItem: HeaderInfo | undefined = aggregated[aggregated.length - 1];

        if (column.groupPath && column.groupPath.length > depth) {
          if (lastItem && lastItem.groupId === column.groupPath[depth]) {
            // Merge with the previous columns
            return [
              ...aggregated.slice(0, aggregated.length - 1),
              {
                ...lastItem,
                width: lastItem.width + (column.width ?? 0),
                fields: [...lastItem.fields, column.field],
              },
            ];
          }
          // Create a new grouping
          return [
            ...aggregated,
            {
              groupId: column.groupPath[depth],
              width: column.width ?? 0,
              fields: [column.field],
              colIndex: firstColumnToRender + i,
            },
          ];
        }

        // It is the first level for which their is no group
        if (MERGE_EMPTY_CELLS && lastItem && lastItem.groupId === null) {
          // We merge with previous column
          return [
            ...aggregated.slice(0, aggregated.length - 1),
            {
              ...lastItem,
              width: lastItem.width + (column.width ?? 0),
              fields: [...lastItem.fields, column.field],
            },
          ];
        }
        // We create new empty cell
        return [
          ...aggregated,
          {
            groupId: null,
            width: column.width ?? 0,
            fields: [column.field],
            colIndex: firstColumnToRender + i,
          },
        ];
      }, initialHeader);

      columnIndex = lastColumnToRender;
      const lastColumnToRenderGroup = depthInfo[depthInfo.length - 1].groupId;

      while (
        lastColumnToRenderGroup !== null &&
        columnIndex < maxLastColumn &&
        visibleColumns[columnIndex]?.groupPath &&
        visibleColumns[columnIndex]?.groupPath?.[depth] === lastColumnToRenderGroup
      ) {
        const column = visibleColumns[columnIndex];

        depthInfo[depthInfo.length - 1].width += column.width ?? 0;
        depthInfo[depthInfo.length - 1].fields.push(column.field);
        columnIndex += 1;
      }

      headerToRender.push({ leftOverflow, elements: [...depthInfo] });
    }

    headerToRender.forEach((depthInfo, depthIndex) => {
      columns.push(
        <GridColumnHeaderRow
          style={{
            lineHeight: `${headerGroupingRowHeight}px`,
            transform: `translateX(-${depthInfo.leftOverflow}px)`,
          }}
          key={depthIndex}
          role="row"
          aria-rowindex={depthIndex + 1}
        >
          {depthInfo.elements.map(({ groupId, width, fields, colIndex }, groupIndex) => {
            return (
              <GridColumnGroupHeader
                key={groupIndex}
                groupId={groupId}
                width={width}
                fields={fields}
                colIndex={colIndex}
                depth={depthIndex}
                isLastColumn={colIndex === visibleColumns.length - fields.length}
                extendRowFullWidth={!rootProps.disableExtendRowFullWidth}
                maxDepth={headerToRender.length}
                height={headerGroupingRowHeight}
              />
            );
          })}
        </GridColumnHeaderRow>,
      );
    });
    return columns;
  };

  const rootStyle = {
    minHeight: totalHeaderHeight,
    maxHeight: totalHeaderHeight,
    lineHeight: `${headerHeight}px`,
  };

  return {
    renderContext,
    getColumnsHeader,
    getColumnsHeaderGroups,
    isDragging: !!dragCol,
    getRootProps: (other = {}) => ({ style: rootStyle, ...other }),
    getInnerProps: () => ({
      ref: handleInnerRef,
      role: 'rowgroup',
    }),
  };
};
