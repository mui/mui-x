import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridSelector } from '../../utils';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import type { GridColumnsRenderContext } from '../../../models/params/gridScrollParams';
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
  gridColumnLookupSelector,
} from '../columns';
import { GridGroupingStructure } from '../columnGrouping/gridColumnGroupsInterfaces';
import { gridColumnGroupsUnwrappedModelSelector } from '../columnGrouping/gridColumnGroupsSelector';
import { GridScrollbarFillerCell as ScrollbarFiller } from '../../../components/GridScrollbarFillerCell';
import { getPinnedCellOffset } from '../../../internals/utils/getPinnedCellOffset';
import { GridColumnHeaderSeparatorSides } from '../../../components/columnHeaders/GridColumnHeaderSeparator';
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
  renderContext?: GridColumnsRenderContext;
  maxLastColumn?: number;
}

type OwnerState = DataGridProcessedProps;

export const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (_, styles) => styles.columnHeaderRow,
})<{ ownerState: OwnerState }>({
  display: 'flex',
});

export const useGridColumnHeaders = (props: UseGridColumnHeadersProps) => {
  const {
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
  const isRtl = useRtl();
  const rootProps = useGridRootProps();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const hasVirtualization = useGridSelector(apiRef, gridVirtualizationColumnEnabledSelector);
  const columnGroupsModel = useGridSelector(apiRef, gridColumnGroupsUnwrappedModelSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const renderContext = useGridSelector(apiRef, gridRenderContextColumnsSelector);
  const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const offsetLeft = computeOffsetLeft(columnPositions, renderContext, pinnedColumns.left.length);
  const gridHasFiller = dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width;

  React.useEffect(() => {
    if (apiRef.current.columnHeadersContainerRef.current) {
      apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
    }
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

  const leftRenderContext = React.useMemo(() => {
    return pinnedColumns.left.length
      ? {
          firstColumnIndex: 0,
          lastColumnIndex: pinnedColumns.left.length,
        }
      : null;
  }, [pinnedColumns.left.length]);

  const rightRenderContext = React.useMemo(() => {
    return pinnedColumns.right.length
      ? {
          firstColumnIndex: visibleColumns.length - pinnedColumns.right.length,
          lastColumnIndex: visibleColumns.length,
        }
      : null;
  }, [pinnedColumns.right.length, visibleColumns.length]);

  useGridApiEventHandler(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);

  // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
  const getColumnsToRender = (params?: GetHeadersParams) => {
    const { renderContext: currentContext = renderContext, maxLastColumn = visibleColumns.length } =
      params || {};

    const firstColumnToRender = currentContext.firstColumnIndex;
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
    borderBottom: boolean = false,
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
        {isNotPinned && (
          <div
            role="presentation"
            className={clsx(
              gridClasses.filler,
              borderBottom && gridClasses['filler--borderBottom'],
            )}
          />
        )}
        {hasScrollbarFiller && (
          <ScrollbarFiller
            header
            pinnedRight={isPinnedRight}
            borderBottom={borderBottom}
            borderTop={false}
          />
        )}
      </React.Fragment>
    );
  };

  const getCellOffsetStyle = ({
    pinnedPosition,
    columnIndex,
    computedWidth,
  }: {
    pinnedPosition?: GridPinnedColumnPosition;
    columnIndex: number;
    computedWidth: number;
  }) => {
    let style: React.CSSProperties | undefined;

    const isLeftPinned = pinnedPosition === GridPinnedColumnPosition.LEFT;
    const isRightPinned = pinnedPosition === GridPinnedColumnPosition.RIGHT;

    if (isLeftPinned || isRightPinned) {
      const pinnedOffset = getPinnedCellOffset(
        pinnedPosition,
        computedWidth,
        columnIndex,
        columnPositions,
        dimensions,
      );
      let side = isLeftPinned ? 'left' : 'right';

      if (isRtl) {
        side = isLeftPinned ? 'right' : 'left';
      }

      if (pinnedPosition === 'left') {
        style = { [side]: pinnedOffset };
      }

      if (pinnedPosition === 'right') {
        style = { [side]: pinnedOffset };
      }
    }

    return style;
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
      const pinnedPosition = params?.position;

      const style = getCellOffsetStyle({
        pinnedPosition,
        columnIndex,
        computedWidth: colDef.computedWidth,
      });

      const siblingWithBorderingSeparator =
        pinnedPosition === GridPinnedColumnPosition.RIGHT
          ? renderedColumns[i - 1]
          : renderedColumns[i + 1];
      const isSiblingFocused = siblingWithBorderingSeparator
        ? columnHeaderFocus !== null &&
          columnHeaderFocus.field === siblingWithBorderingSeparator.field
        : false;
      const isLastUnpinned =
        columnIndex + 1 === columnPositions.length - pinnedColumns.right.length;

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
          isLast={columnIndex === columnPositions.length - 1}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          pinnedPosition={pinnedPosition}
          style={style}
          indexInSection={i}
          sectionLength={renderedColumns.length}
          gridHasFiller={gridHasFiller}
          isLastUnpinned={isLastUnpinned}
          isSiblingFocused={isSiblingFocused}
          {...other}
        />,
      );
    }

    return getFillers(params, columns, 0);
  };

  const getColumnHeadersRow = () => {
    return (
      <GridColumnHeaderRow
        role="row"
        aria-rowindex={headerGroupingMaxDepth + 1}
        ownerState={rootProps}
        className={gridClasses['row--borderBottom']}
      >
        {leftRenderContext &&
          getColumnHeaders(
            {
              position: GridPinnedColumnPosition.LEFT,
              renderContext: leftRenderContext,
              maxLastColumn: leftRenderContext.lastColumnIndex,
            },
            { disableReorder: true },
          )}
        {getColumnHeaders({
          renderContext,
          maxLastColumn: visibleColumns.length - pinnedColumns.right.length,
        })}
        {rightRenderContext &&
          getColumnHeaders(
            {
              position: GridPinnedColumnPosition.RIGHT,
              renderContext: rightRenderContext,
              maxLastColumn: rightRenderContext.lastColumnIndex,
            },
            {
              disableReorder: true,
              separatorSide: GridColumnHeaderSeparatorSides.Left,
            },
          )}
      </GridColumnHeaderRow>
    );
  };

  const getColumnGroupHeaders = ({
    depth,
    params,
  }: {
    depth: number;
    params: GetHeadersParams;
  }) => {
    const columnsToRender = getColumnsToRender(params);
    if (columnsToRender.renderedColumns.length === 0) {
      return null;
    }

    const { firstColumnToRender, lastColumnToRender } = columnsToRender;

    const rowStructure = columnGroupsHeaderStructure[depth];

    const firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
    const firstGroupToRender = columnGroupsModel[firstColumnFieldToRender]?.[depth] ?? null;

    const firstGroupIndex = rowStructure.findIndex(
      ({ groupId, columnFields }) =>
        groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender),
    );

    const lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
    const lastGroupToRender = columnGroupsModel[lastColumnFieldToRender]?.[depth] ?? null;

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
      const column = columnsLookup[field];
      return acc + (column.computedWidth ?? 0);
    }, 0);

    let columnIndex = firstColumnToRender;
    const children = visibleColumnGroupHeader.map(({ groupId, columnFields }, index) => {
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
        width: columnFields.reduce((acc, field) => acc + columnsLookup[field].computedWidth, 0),
        fields: columnFields,
        colIndex: columnIndex,
        hasFocus,
        tabIndex,
      };

      const pinnedPosition = params.position;
      const style = getCellOffsetStyle({
        pinnedPosition,
        columnIndex,
        computedWidth: headerInfo.width,
      });

      columnIndex += columnFields.length;

      let indexInSection = index;
      if (pinnedPosition === 'left') {
        // Group headers can expand to multiple columns, we need to adjust the index
        indexInSection = columnIndex - 1;
      }

      return (
        <GridColumnGroupHeader
          key={index}
          groupId={groupId}
          width={headerInfo.width}
          fields={headerInfo.fields}
          colIndex={headerInfo.colIndex}
          depth={depth}
          isLastColumn={index === visibleColumnGroupHeader.length - 1}
          maxDepth={headerGroupingMaxDepth}
          height={dimensions.groupHeaderHeight}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          pinnedPosition={pinnedPosition}
          style={style}
          indexInSection={indexInSection}
          sectionLength={visibleColumnGroupHeader.length}
          gridHasFiller={gridHasFiller}
        />
      );
    });

    return getFillers(params, children, leftOverflow);
  };

  const getColumnGroupHeadersRows = () => {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }

    const headerRows: React.JSX.Element[] = [];

    for (let depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      headerRows.push(
        <GridColumnHeaderRow
          key={depth}
          role="row"
          aria-rowindex={depth + 1}
          ownerState={rootProps}
        >
          {leftRenderContext &&
            getColumnGroupHeaders({
              depth,
              params: {
                position: GridPinnedColumnPosition.LEFT,
                renderContext: leftRenderContext,
                maxLastColumn: leftRenderContext.lastColumnIndex,
              },
            })}
          {getColumnGroupHeaders({ depth, params: { renderContext } })}
          {rightRenderContext &&
            getColumnGroupHeaders({
              depth,
              params: {
                position: GridPinnedColumnPosition.RIGHT,
                renderContext: rightRenderContext,
                maxLastColumn: rightRenderContext.lastColumnIndex,
              },
            })}
        </GridColumnHeaderRow>,
      );
    }

    return headerRows;
  };

  return {
    renderContext,
    leftRenderContext,
    rightRenderContext,
    pinnedColumns,
    visibleColumns,
    getCellOffsetStyle,
    getFillers,
    getColumnHeadersRow,
    getColumnsToRender,
    getColumnGroupHeadersRows,
    isDragging: !!dragCol,
    getInnerProps: () => ({
      role: 'rowgroup',
    }),
  };
};
