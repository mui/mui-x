import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { styled, useTheme } from '@mui/system';
import { defaultMemoize } from 'reselect';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEventListener } from '../../../models/events';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { getFirstColumnIndexToRender, getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import {
  areRenderContextsEqual,
  getRenderableIndexes,
} from '../virtualization/useGridVirtualScroller';
import { GridColumnGroupHeader } from '../../../components/columnHeaders/GridColumnGroupHeader';
import { GridColumnGroup } from '../../../models/gridColumnGrouping';
import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { GridSortColumnLookup } from '../sorting';
import { GridFilterActiveItemsLookup } from '../filter';
import { GridColumnGroupIdentifier, GridColumnIdentifier } from '../focus';
import { GridColumnMenuState } from '../columnMenu';
import { GridColumnVisibilityModel } from '../columns';
import { GridGroupingStructure } from '../columnGrouping/gridColumnGroupsInterfaces';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps;

const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (props, styles) => styles.columnHeaderRow,
})<{ ownerState: OwnerState }>(() => ({
  display: 'flex',
}));

interface HeaderInfo {
  groupId: GridColumnGroup['groupId'] | null;
  width: number;
  fields: string[];
  colIndex: number;
  hasFocus: boolean;
  tabIndex: -1 | 0;
  description?: string;
}

export interface UseGridColumnHeadersProps {
  innerRef?: React.Ref<HTMLDivElement>;
  minColumnIndex?: number;
  visibleColumns: GridStateColDef[];
  sortColumnLookup: GridSortColumnLookup;
  filterColumnLookup: GridFilterActiveItemsLookup;
  columnPositions: number[];
  columnHeaderTabIndexState: GridColumnIdentifier | null;
  columnGroupHeaderTabIndexState: GridColumnGroupIdentifier | null;
  columnHeaderFocus: GridColumnIdentifier | null;
  columnGroupHeaderFocus: GridColumnGroupIdentifier | null;
  densityFactor: number;
  headerGroupingMaxDepth: number;
  columnMenuState: GridColumnMenuState;
  columnVisibility: GridColumnVisibilityModel;
  columnGroupsHeaderStructure: GridGroupingStructure[][];
  hasOtherElementInTabSequence: boolean;
}

export interface GetHeadersParams {
  renderContext: GridRenderContext | null;
  minFirstColumn?: number;
  maxLastColumn?: number;
}

function isUIEvent(event: any): event is React.UIEvent {
  return !!event.target;
}

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const {
    innerRef: innerRefProp,
    minColumnIndex = 0,
    visibleColumns,
    sortColumnLookup,
    filterColumnLookup,
    columnPositions,
    columnHeaderTabIndexState,
    columnGroupHeaderTabIndexState,
    columnHeaderFocus,
    columnGroupHeaderFocus,
    densityFactor,
    headerGroupingMaxDepth,
    columnMenuState,
    columnVisibility,
    columnGroupsHeaderStructure,
    hasOtherElementInTabSequence,
  } = props;
  const theme = useTheme();

  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');

  const apiRef = useGridPrivateApiContext();

  const rootProps = useGridRootProps();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const handleInnerRef = useForkRef(innerRefProp, innerRef);
  const [renderContext, setRenderContextRaw] = React.useState<GridRenderContext | null>(null);
  const prevRenderContext = React.useRef<GridRenderContext | null>(renderContext);
  const prevScrollLeft = React.useRef(0);
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, rootProps.columnHeaderHeight);
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);

  const setRenderContext = React.useCallback(
    (nextRenderContext: GridRenderContext | null) => {
      if (
        renderContext &&
        nextRenderContext &&
        areRenderContextsEqual(renderContext, nextRenderContext)
      ) {
        return;
      }
      setRenderContextRaw(nextRenderContext);
    },
    [renderContext],
  );

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

      const direction = theme.direction === 'ltr' ? 1 : -1;

      const offset =
        firstColumnToRender > 0
          ? prevScrollLeft.current - direction * columnPositions[firstColumnToRender]
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
      theme.direction,
    ],
  );

  React.useLayoutEffect(() => {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);

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
    [updateInnerPosition, setRenderContext],
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

  const getColumnHeaders = (params?: GetHeadersParams, other = {}) => {
    const columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null) {
      return null;
    }

    const { renderedColumns, firstColumnToRender } = columnsToRender;

    const columns: React.JSX.Element[] = [];
    for (let i = 0; i < renderedColumns.length; i += 1) {
      const colDef = renderedColumns[i];

      const columnIndex = firstColumnToRender + i;
      const isFirstColumn = columnIndex === 0;
      const tabIndex =
        (columnHeaderTabIndexState !== null && columnHeaderTabIndexState.field === colDef.field) ||
        (isFirstColumn && !hasOtherElementInTabSequence)
          ? 0
          : -1;
      const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === colDef.field;
      const open = columnMenuState.open && columnMenuState.field === colDef.field;

      columns.push(
        <GridColumnHeaderItem
          key={colDef.field}
          {...sortColumnLookup[colDef.field]}
          columnMenuOpen={open}
          filterItemsCounter={
            filterColumnLookup[colDef.field] && filterColumnLookup[colDef.field].length
          }
          headerHeight={headerHeight}
          isDragging={colDef.field === dragCol}
          colDef={colDef}
          colIndex={columnIndex}
          isResizing={resizeCol === colDef.field}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          {...other}
        />,
      );
    }

    return (
      <GridColumnHeaderRow
        role="row"
        aria-rowindex={headerGroupingMaxDepth + 1}
        ownerState={rootProps}
      >
        {columns}
      </GridColumnHeaderRow>
    );
  };

  const getColumnGroupHeaders = (params?: GetHeadersParams) => {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }
    const columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null || columnsToRender.renderedColumns.length === 0) {
      return null;
    }

    const { firstColumnToRender, lastColumnToRender } = columnsToRender;

    const columns: React.JSX.Element[] = [];

    const headerToRender: {
      leftOverflow: number;
      elements: HeaderInfo[];
    }[] = [];

    for (let depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      const rowStructure = columnGroupsHeaderStructure[depth];

      const firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
      const firstGroupToRender =
        apiRef.current.unstable_getColumnGroupPath(firstColumnFieldToRender)[depth] ?? null;

      const firstGroupIndex = rowStructure.findIndex(
        ({ groupId, columnFields }) =>
          groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender),
      );

      const lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
      const lastGroupToRender =
        apiRef.current.unstable_getColumnGroupPath(lastColumnFieldToRender)[depth] ?? null;
      const lastGroupIndex = rowStructure.findIndex(
        ({ groupId, columnFields }) =>
          groupId === lastGroupToRender && columnFields.includes(lastColumnFieldToRender),
      );

      const visibleColumnGroupHeader = rowStructure
        .slice(firstGroupIndex, lastGroupIndex + 1)
        .map((groupStructure) => {
          return {
            ...groupStructure,
            columnFields: groupStructure.columnFields.filter(
              (field) => columnVisibility[field] !== false,
            ),
          };
        })
        .filter((groupStructure) => groupStructure.columnFields.length > 0);

      const firstVisibleColumnIndex =
        visibleColumnGroupHeader[0].columnFields.indexOf(firstColumnFieldToRender);
      const hiddenGroupColumns = visibleColumnGroupHeader[0].columnFields.slice(
        0,
        firstVisibleColumnIndex,
      );
      const leftOverflow = hiddenGroupColumns.reduce((acc, field) => {
        const column = apiRef.current.getColumn(field);
        return acc + (column.computedWidth ?? 0);
      }, 0);

      let columnIndex = firstColumnToRender;
      const elements = visibleColumnGroupHeader.map(({ groupId, columnFields }) => {
        const hasFocus =
          columnGroupHeaderFocus !== null &&
          columnGroupHeaderFocus.depth === depth &&
          columnFields.includes(columnGroupHeaderFocus.field);
        const tabIndex: 0 | -1 =
          columnGroupHeaderTabIndexState !== null &&
          columnGroupHeaderTabIndexState.depth === depth &&
          columnFields.includes(columnGroupHeaderTabIndexState.field)
            ? 0
            : -1;

        const headerInfo: HeaderInfo = {
          groupId,
          width: columnFields.reduce(
            (acc, field) => acc + apiRef.current.getColumn(field).computedWidth,
            0,
          ),
          fields: columnFields,
          colIndex: columnIndex,
          hasFocus,
          tabIndex,
        };

        columnIndex += columnFields.length;
        return headerInfo;
      });

      headerToRender.push({ leftOverflow, elements });
    }

    headerToRender.forEach((depthInfo, depthIndex) => {
      columns.push(
        <GridColumnHeaderRow
          style={{
            height: `${headerHeight}px`,
            transform: `translateX(-${depthInfo.leftOverflow}px)`,
          }}
          key={depthIndex}
          role="row"
          aria-rowindex={depthIndex + 1}
          ownerState={rootProps}
        >
          {depthInfo.elements.map(
            ({ groupId, width, fields, colIndex, hasFocus, tabIndex }, groupIndex) => {
              return (
                <GridColumnGroupHeader
                  key={groupIndex}
                  groupId={groupId}
                  width={width}
                  fields={fields}
                  colIndex={colIndex}
                  depth={depthIndex}
                  isLastColumn={colIndex === visibleColumns.length - fields.length}
                  maxDepth={headerToRender.length}
                  height={headerHeight}
                  hasFocus={hasFocus}
                  tabIndex={tabIndex}
                />
              );
            },
          )}
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
    getColumnHeaders,
    getColumnsToRender,
    getColumnGroupHeaders,
    isDragging: !!dragCol,
    getRootProps: (other = {}) => ({ style: rootStyle, ...other }),
    getInnerProps: () => ({
      ref: handleInnerRef,
      role: 'rowgroup',
    }),
    headerHeight,
  };
};
