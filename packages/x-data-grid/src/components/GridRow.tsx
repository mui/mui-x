'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
import { GridRowEventLookup } from '../models/events';
import { GridRowId, GridRowModel } from '../models/gridRows';
import { GridEditModes, GridCellModes } from '../models/gridEditRowModel';
import { gridClasses } from '../constants/gridClasses';
import { composeGridClasses } from '../utils/composeGridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridPinnedColumns } from '../hooks/features/columns';
import type { GridStateColDef } from '../models/colDef/gridColDef';
import { shouldCellShowLeftBorder, shouldCellShowRightBorder } from '../utils/cellBorderUtils';
import { gridColumnPositionsSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector, objectShallowCompare } from '../hooks/utils/useGridSelector';
import { GridRowClassNameParams } from '../models/params/gridRowParams';
import { useGridVisibleRows } from '../hooks/utils/useGridVisibleRows';
import { findParentElementFromClassName, isEventTargetInPortal } from '../utils/domUtils';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../colDef/gridCheckboxSelectionColDef';
import { GRID_ACTIONS_COLUMN_TYPE } from '../colDef/gridActionsColDef';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD, PinnedColumnPosition } from '../internals/constants';
import { gridSortModelSelector } from '../hooks/features/sorting/gridSortingSelector';
import {
  gridRowMaximumTreeDepthSelector,
  gridRowNodeSelector,
} from '../hooks/features/rows/gridRowsSelector';
import {
  gridEditRowsStateSelector,
  gridRowIsEditingSelector,
} from '../hooks/features/editing/gridEditingSelectors';
import { getPinnedCellOffset } from '../internals/utils/getPinnedCellOffset';
import { useGridConfiguration } from '../hooks/utils/useGridConfiguration';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { createSelector } from '../utils/createSelector';

const isRowReorderingEnabledSelector = createSelector(
  gridEditRowsStateSelector,
  (editRows, rowReordering: boolean) => {
    if (!rowReordering) {
      return false;
    }
    const isEditingRows = !isObjectEmpty(editRows);
    return !isEditingRows;
  },
);

export interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  row: GridRowModel;
  rowId: GridRowId;
  selected: boolean;
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: number;
  rowHeight: number | 'auto';
  offsetLeft: number;
  columnsTotalWidth: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
  visibleColumns: GridStateColDef[];
  pinnedColumns: GridPinnedColumns;
  /**
   * Determines which cell has focus.
   * If `null`, no cell in this row has focus.
   */
  focusedColumnIndex: number | undefined;
  isFirstVisible: boolean;
  isLastVisible: boolean;
  isNotVisible: boolean;
  showBottomBorder: boolean;
  scrollbarWidth: number;
  gridHasFiller: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  [x: `data-${string}`]: string;
}

const GridRow = forwardRef<HTMLDivElement, GridRowProps>(function GridRow(props, refProp) {
  const {
    selected,
    rowId,
    row,
    index,
    style: styleProp,
    rowHeight,
    className,
    visibleColumns,
    pinnedColumns,
    offsetLeft,
    columnsTotalWidth,
    firstColumnIndex,
    lastColumnIndex,
    focusedColumnIndex,
    isFirstVisible,
    isLastVisible,
    isNotVisible,
    showBottomBorder,
    scrollbarWidth,
    gridHasFiller,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave,
    onMouseOut,
    onMouseOver,
    ...other
  } = props;
  const apiRef = useGridPrivateApiContext();
  const configuration = useGridConfiguration();
  const ref = React.useRef<HTMLDivElement>(null);
  const rootProps = useGridRootProps();
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const rowReordering = (rootProps as any).rowReordering as boolean;
  const isRowReorderingEnabled = useGridSelector(
    apiRef,
    isRowReorderingEnabledSelector,
    rowReordering,
  );
  const handleRef = useForkRef(ref, refProp);
  const rowNode = gridRowNodeSelector(apiRef, rowId);
  const editing = useGridSelector(apiRef, gridRowIsEditingSelector, {
    rowId,
    editMode: rootProps.editMode,
  });
  const editable = rootProps.editMode === GridEditModes.Row;
  const hasFocusCell = focusedColumnIndex !== undefined;
  const hasVirtualFocusCellLeft =
    hasFocusCell &&
    focusedColumnIndex >= pinnedColumns.left.length &&
    focusedColumnIndex < firstColumnIndex;
  const hasVirtualFocusCellRight =
    hasFocusCell &&
    focusedColumnIndex < visibleColumns.length - pinnedColumns.right.length &&
    focusedColumnIndex >= lastColumnIndex;

  const classes = composeGridClasses(rootProps.classes, {
    root: [
      'row',
      selected && 'selected',
      editable && 'row--editable',
      editing && 'row--editing',
      isFirstVisible && 'row--firstVisible',
      isLastVisible && 'row--lastVisible',
      showBottomBorder && 'row--borderBottom',
      rowHeight === 'auto' && 'row--dynamicHeight',
    ],
  });
  const getRowAriaAttributes = configuration.hooks.useGridRowAriaAttributes();

  React.useLayoutEffect(() => {
    if (currentPage.range) {
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
      // Pinned rows are not part of the visible rows
      if (rowIndex !== undefined) {
        apiRef.current.unstable_setLastMeasuredRowIndex(rowIndex);
      }
    }

    if (ref.current && rowHeight === 'auto') {
      return apiRef.current.observeRowHeight(ref.current, rowId);
    }

    return undefined;
  }, [apiRef, currentPage.range, rowHeight, rowId]);

  const publish = React.useCallback(
    (
      eventName: keyof GridRowEventLookup,
      propHandler: React.MouseEventHandler<HTMLDivElement> | undefined,
    ): React.MouseEventHandler<HTMLDivElement> =>
      (event) => {
        // Ignore portal
        if (isEventTargetInPortal(event)) {
          return;
        }

        // The row might have been deleted
        if (!apiRef.current.getRow(rowId)) {
          return;
        }

        apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(rowId), event);

        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, rowId],
  );

  const publishClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const cell = findParentElementFromClassName(event.target as HTMLDivElement, gridClasses.cell);
      const field = cell?.getAttribute('data-field');

      // Check if the field is available because the cell that fills the empty
      // space of the row has no field.
      if (field) {
        // User clicked in the checkbox added by checkboxSelection
        if (field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
          return;
        }

        // User opened a detail panel
        if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
          return;
        }

        // User reorders a row
        if (field === '__reorder__') {
          return;
        }

        // User is editing a cell
        if (apiRef.current.getCellMode(rowId, field) === GridCellModes.Edit) {
          return;
        }

        // User clicked a button from the "actions" column type
        const column = apiRef.current.getColumn(field);
        if (column?.type === GRID_ACTIONS_COLUMN_TYPE) {
          return;
        }
      }

      publish('rowClick', onClick)(event);
    },
    [apiRef, onClick, publish, rowId],
  );

  const { slots, slotProps, disableColumnReorder } = rootProps;

  const heightEntry = useGridSelector(
    apiRef,
    () => ({ ...apiRef.current.getRowHeightEntry(rowId) }),
    undefined,
    objectShallowCompare,
  );

  const style = React.useMemo(() => {
    if (isNotVisible) {
      return {
        opacity: 0,
        width: 0,
        height: 0,
      };
    }

    const rowStyle = {
      ...styleProp,
      maxHeight: rowHeight === 'auto' ? 'none' : rowHeight, // max-height doesn't support "auto"
      minHeight: rowHeight,
      '--height': typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight,
    };

    if (heightEntry.spacingTop) {
      const property = rootProps.rowSpacingType === 'border' ? 'borderTopWidth' : 'marginTop';
      rowStyle[property] = heightEntry.spacingTop;
    }

    if (heightEntry.spacingBottom) {
      const property = rootProps.rowSpacingType === 'border' ? 'borderBottomWidth' : 'marginBottom';
      let propertyValue = rowStyle[property];
      // avoid overriding existing value
      if (typeof propertyValue !== 'number') {
        propertyValue = parseInt(propertyValue || '0', 10);
      }
      propertyValue += heightEntry.spacingBottom;
      rowStyle[property] = propertyValue;
    }

    return rowStyle;
  }, [isNotVisible, rowHeight, styleProp, heightEntry, rootProps.rowSpacingType]);

  const rowClassNames = apiRef.current.unstable_applyPipeProcessors('rowClassName', [], rowId);
  const ariaAttributes = getRowAriaAttributes(rowNode, index);

  if (typeof rootProps.getRowClassName === 'function') {
    const indexRelativeToCurrentPage = index - (currentPage.range?.firstRowIndex || 0);
    const rowParams: GridRowClassNameParams = {
      ...apiRef.current.getRowParams(rowId),
      isFirstVisible: indexRelativeToCurrentPage === 0,
      isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
      indexRelativeToCurrentPage,
    };

    rowClassNames.push(rootProps.getRowClassName(rowParams));
  }

  const getCell = (
    column: GridStateColDef,
    indexInSection: number,
    indexRelativeToAllColumns: number,
    sectionLength: number,
    pinnedPosition = PinnedColumnPosition.NONE,
  ) => {
    const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(
      rowId,
      indexRelativeToAllColumns,
    );

    if (cellColSpanInfo?.spannedByColSpan) {
      return null;
    }

    const width = cellColSpanInfo?.cellProps.width ?? column.computedWidth;
    const colSpan = cellColSpanInfo?.cellProps.colSpan ?? 1;

    const pinnedOffset = getPinnedCellOffset(
      pinnedPosition,
      column.computedWidth,
      indexRelativeToAllColumns,
      columnPositions,
      columnsTotalWidth,
      scrollbarWidth,
    );

    if (rowNode.type === 'skeletonRow') {
      return (
        <slots.skeletonCell
          key={column.field}
          type={column.type}
          width={width}
          height={rowHeight}
          field={column.field}
          align={column.align}
        />
      );
    }

    // when the cell is a reorder cell we are not allowing to reorder the col
    // fixes https://github.com/mui/mui-x/issues/11126
    const isReorderCell = column.field === '__reorder__';

    const canReorderColumn = !(disableColumnReorder || column.disableReorder);
    const canReorderRow = isRowReorderingEnabled && !sortModel.length && treeDepth <= 1;

    const disableDragEvents = !(canReorderColumn || (isReorderCell && canReorderRow));

    const cellIsNotVisible = pinnedPosition === PinnedColumnPosition.VIRTUAL;

    const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, indexInSection);
    const showRightBorder = shouldCellShowRightBorder(
      pinnedPosition,
      indexInSection,
      sectionLength,
      rootProps.showCellVerticalBorder,
      gridHasFiller,
    );

    return (
      <slots.cell
        key={column.field}
        column={column}
        width={width}
        rowId={rowId}
        align={column.align || 'left'}
        colIndex={indexRelativeToAllColumns}
        colSpan={colSpan}
        disableDragEvents={disableDragEvents}
        isNotVisible={cellIsNotVisible}
        pinnedOffset={pinnedOffset}
        pinnedPosition={pinnedPosition}
        showLeftBorder={showLeftBorder}
        showRightBorder={showRightBorder}
        row={row}
        rowNode={rowNode}
        {...slotProps?.cell}
      />
    );
  };

  const leftCells = pinnedColumns.left.map((column, i) => {
    const indexRelativeToAllColumns = i;
    return getCell(
      column,
      i,
      indexRelativeToAllColumns,
      pinnedColumns.left.length,
      PinnedColumnPosition.LEFT,
    );
  });

  const rightCells = pinnedColumns.right.map((column, i) => {
    const indexRelativeToAllColumns = visibleColumns.length - pinnedColumns.right.length + i;
    return getCell(
      column,
      i,
      indexRelativeToAllColumns,
      pinnedColumns.right.length,
      PinnedColumnPosition.RIGHT,
    );
  });

  const middleColumnsLength =
    visibleColumns.length - pinnedColumns.left.length - pinnedColumns.right.length;

  const cells = [] as React.ReactNode[];
  if (hasVirtualFocusCellLeft) {
    cells.push(
      getCell(
        visibleColumns[focusedColumnIndex],
        focusedColumnIndex - pinnedColumns.left.length,
        focusedColumnIndex,
        middleColumnsLength,
        PinnedColumnPosition.VIRTUAL,
      ),
    );
  }

  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    const column = visibleColumns[i];
    const indexInSection = i - pinnedColumns.left.length;

    if (!column) {
      continue;
    }

    cells.push(getCell(column, indexInSection, i, middleColumnsLength));
  }

  if (hasVirtualFocusCellRight) {
    cells.push(
      getCell(
        visibleColumns[focusedColumnIndex],
        focusedColumnIndex - pinnedColumns.left.length,
        focusedColumnIndex,
        middleColumnsLength,
        PinnedColumnPosition.VIRTUAL,
      ),
    );
  }

  const eventHandlers = row
    ? {
        onClick: publishClick,
        onDoubleClick: publish('rowDoubleClick', onDoubleClick),
        onMouseEnter: publish('rowMouseEnter', onMouseEnter),
        onMouseLeave: publish('rowMouseLeave', onMouseLeave),
        onMouseOut: publish('rowMouseOut', onMouseOut),
        onMouseOver: publish('rowMouseOver', onMouseOver),
      }
    : null;

  return (
    <div
      data-id={rowId}
      data-rowindex={index}
      role="row"
      className={clsx(...rowClassNames, classes.root, className)}
      style={style}
      {...ariaAttributes}
      {...eventHandlers}
      {...other}
      ref={handleRef}
    >
      {leftCells}
      <div
        role="presentation"
        className={gridClasses.cellOffsetLeft}
        style={{ width: offsetLeft }}
      />
      {cells}
      <div role="presentation" className={clsx(gridClasses.cell, gridClasses.cellEmpty)} />
      {rightCells}
    </div>
  );
});

GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  columnsTotalWidth: PropTypes.number.isRequired,
  firstColumnIndex: PropTypes.number.isRequired,
  /**
   * Determines which cell has focus.
   * If `null`, no cell in this row has focus.
   */
  focusedColumnIndex: PropTypes.number,
  gridHasFiller: PropTypes.bool.isRequired,
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: PropTypes.number.isRequired,
  isFirstVisible: PropTypes.bool.isRequired,
  isLastVisible: PropTypes.bool.isRequired,
  isNotVisible: PropTypes.bool.isRequired,
  lastColumnIndex: PropTypes.number.isRequired,
  offsetLeft: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  pinnedColumns: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  rowHeight: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  scrollbarWidth: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  showBottomBorder: PropTypes.bool.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

const MemoizedGridRow = fastMemo(GridRow);

export { MemoizedGridRow as GridRow };
