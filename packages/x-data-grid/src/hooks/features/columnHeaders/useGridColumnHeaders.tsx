import * as React from 'react';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { styled, useTheme } from '@mui/material/styles';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridSelector } from '../../utils';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEventListener } from '../../../models/events';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { gridDimensionsSelector } from '../dimensions';
import {
  gridRenderContextColumnsSelector,
  gridVirtualizationColumnEnabledSelector,
} from '../virtualization';
import { computeOffsetLeft } from '../virtualization/useGridVirtualScroller';
import { GridColumnGroupHeader } from '../../../components/columnHeaders/GridColumnGroupHeader';
import { GridColumnGroup } from '../../../models/gridColumnGrouping';
import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { GridSortColumnLookup } from '../sorting';
import { GridFilterActiveItemsLookup } from '../filter';
import { GridColumnGroupIdentifier, GridColumnIdentifier } from '../focus';
import { GridColumnMenuState } from '../columnMenu';
import {
  GridPinnedColumnPosition,
  GridColumnVisibilityModel,
  gridColumnPositionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
} from '../columns';
import { GridGroupingStructure } from '../columnGrouping/gridColumnGroupsInterfaces';
import { GridScrollbarFillerCell as ScrollbarFiller } from '../../../components/GridScrollbarFillerCell';
import { gridClasses } from '../../../constants/gridClasses';

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
  visibleColumns: GridStateColDef[];
  sortColumnLookup: GridSortColumnLookup;
  filterColumnLookup: GridFilterActiveItemsLookup;
  columnHeaderTabIndexState: GridColumnIdentifier | null;
  columnGroupHeaderTabIndexState: GridColumnGroupIdentifier | null;
  columnHeaderFocus: GridColumnIdentifier | null;
  columnGroupHeaderFocus: GridColumnGroupIdentifier | null;
  headerGroupingMaxDepth: number;
  columnMenuState: GridColumnMenuState;
  columnVisibility: GridColumnVisibilityModel;
  columnGroupsHeaderStructure: GridGroupingStructure[][];
  hasOtherElementInTabSequence: boolean;
}

export interface GetHeadersParams {
  position?: GridPinnedColumnPosition;
  renderContext?: GridRenderContext;
  minFirstColumn?: number;
  maxLastColumn?: number;
}

const SpaceFiller = styled('div')({
  /* GridRootStyles conflict */
  '&&&': {
    padding: 0,
    width: 'calc(var(--DataGrid-width) - var(--DataGrid-columnsTotalWidth))',
  },
});

type OwnerState = DataGridProcessedProps;

export const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (_, styles) => styles.columnHeaderRow,
})<{ ownerState: OwnerState }>({
  display: 'flex',
  height: 'var(--DataGrid-headerHeight)',
});

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const {
    innerRef: innerRefProp,
    visibleColumns,
    sortColumnLookup,
    filterColumnLookup,
    columnHeaderTabIndexState,
    columnGroupHeaderTabIndexState,
    columnHeaderFocus,
    columnGroupHeaderFocus,
    headerGroupingMaxDepth,
    columnMenuState,
    columnVisibility,
    columnGroupsHeaderStructure,
    hasOtherElementInTabSequence,
  } = props;

  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');

  const apiRef = useGridPrivateApiContext();
  const theme = useTheme();
  const rootProps = useGridRootProps();
  const hasVirtualization = useGridSelector(apiRef, gridVirtualizationColumnEnabledSelector);

  const innerRef = React.useRef<HTMLDivElement>(null);
  const handleInnerRef = useForkRef(innerRefProp, innerRef);
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const renderContext = useGridSelector(apiRef, gridRenderContextColumnsSelector);
  const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);
  const offsetLeft = computeOffsetLeft(
    columnPositions,
    renderContext,
    theme.direction,
    pinnedColumns.left.length,
  );

  React.useEffect(() => {
    apiRef.current.columnHeadersContainerElementRef!.current!.scrollLeft = 0;
  }, [apiRef]);

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

  // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
  const getColumnsToRender = (params?: GetHeadersParams) => {
    const {
      renderContext: currentContext = renderContext,
      // TODO: `minFirstColumn` is not used anymore, could be refactored out.
      maxLastColumn = visibleColumns.length,
    } = params || {};

    const firstColumnToRender = !hasVirtualization ? 0 : currentContext.firstColumnIndex;
    const lastColumnToRender = !hasVirtualization ? maxLastColumn : currentContext.lastColumnIndex;
    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);

    return {
      renderedColumns,
      firstColumnToRender,
      lastColumnToRender,
    };
  };

  const getFillers = (
    params: GetHeadersParams | undefined,
    children: React.ReactNode,
    leftOverflow: number,
    borderTop: boolean = false,
  ) => {
    const isPinnedRight = params?.position === GridPinnedColumnPosition.RIGHT;
    const isNotPinned = params?.position === undefined;

    const hasScrollbarFiller =
      (pinnedColumns.right.length > 0 && isPinnedRight) ||
      (pinnedColumns.right.length === 0 && isNotPinned);

    const leftOffsetWidth = offsetLeft - leftOverflow;

    return (
      <React.Fragment>
        {isNotPinned && <div role="presentation" style={{ width: leftOffsetWidth }} />}
        {children}
        {isNotPinned && <SpaceFiller className={gridClasses.columnHeader} />}
        {hasScrollbarFiller && (
          <ScrollbarFiller header borderTop={borderTop} pinnedRight={isPinnedRight} />
        )}
      </React.Fragment>
    );
  };

  const getColumnHeaders = (params?: GetHeadersParams, other = {}) => {
    const { renderedColumns, firstColumnToRender } = getColumnsToRender(params);

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
          headerHeight={dimensions.headerHeight}
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
        {getFillers(params, columns, 0)}
      </GridColumnHeaderRow>
    );
  };

  const getColumnGroupHeaders = (params?: GetHeadersParams) => {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }

    const columnsToRender = getColumnsToRender(params);
    if (columnsToRender.renderedColumns.length === 0) {
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
        apiRef.current.getColumnGroupPath(firstColumnFieldToRender)[depth] ?? null;

      const firstGroupIndex = rowStructure.findIndex(
        ({ groupId, columnFields }) =>
          groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender),
      );

      const lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
      const lastGroupToRender =
        apiRef.current.getColumnGroupPath(lastColumnFieldToRender)[depth] ?? null;
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
      const children = depthInfo.elements.map(
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
              height={dimensions.headerHeight}
              hasFocus={hasFocus}
              tabIndex={tabIndex}
            />
          );
        },
      );

      columns.push(
        <GridColumnHeaderRow
          key={depthIndex}
          role="row"
          aria-rowindex={depthIndex + 1}
          ownerState={rootProps}
        >
          {getFillers(params, children, depthInfo.leftOverflow)}
        </GridColumnHeaderRow>,
      );
    });
    return columns;
  };

  return {
    renderContext,
    getFillers,
    getColumnHeaders,
    getColumnsToRender,
    getColumnGroupHeaders,
    isDragging: !!dragCol,
    getInnerProps: () => ({
      ref: handleInnerRef,
      role: 'rowgroup',
    }),
  };
};
