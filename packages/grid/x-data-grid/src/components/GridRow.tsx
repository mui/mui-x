import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_composeClasses as composeClasses,
  unstable_useForkRef as useForkRef,
} from '@mui/utils';
import { fastMemo } from '../utils/fastMemo';
import { GridRowEventLookup } from '../models/events';
import { GridRowId, GridRowModel } from '../models/gridRows';
import { GridEditModes, GridRowModes, GridCellModes } from '../models/gridEditRowModel';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass, gridClasses } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../models/props/DataGridProps';
import type { GridPinnedColumns } from '../hooks/features/columns';
import type { GridStateColDef } from '../models/colDef/gridColDef';
import {
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
} from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector, objectShallowCompare } from '../hooks/utils/useGridSelector';
import { GridRowClassNameParams } from '../models/params/gridRowParams';
import { useGridVisibleRows } from '../hooks/utils/useGridVisibleRows';
import { findParentElementFromClassName } from '../utils/domUtils';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../colDef/gridCheckboxSelectionColDef';
import { GRID_ACTIONS_COLUMN_TYPE } from '../colDef/gridActionsColDef';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../constants/gridDetailPanelToggleField';
import { gridSortModelSelector } from '../hooks/features/sorting/gridSortingSelector';
import { gridRowMaximumTreeDepthSelector } from '../hooks/features/rows/gridRowsSelector';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { randomNumberBetween } from '../utils/utils';
import { PinnedPosition } from './cell/GridCell';
import { gridEditRowsStateSelector } from '../hooks/features/editing/gridEditingSelectors';

export interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  rowId: GridRowId;
  selected: boolean;
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: number;
  rowHeight: number | 'auto';
  containerWidth: number;
  firstColumnToRender: number;
  lastColumnToRender: number;
  visibleColumns: GridStateColDef[];
  renderedColumns: GridStateColDef[];
  pinnedColumns: GridPinnedColumns;
  /**
   * Determines which cell has focus.
   * If `null`, no cell in this row has focus.
   */
  focusedCell: string | null;
  /**
   * Determines which cell should be tabbable by having tabIndex=0.
   * If `null`, no cell in this row is in the tab sequence.
   */
  tabbableCell: string | null;
  row?: GridRowModel;
  isLastVisible?: boolean;
  focusedCellColumnIndexNotInRange?: number;
  isNotVisible?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  [x: string]: any; // Allow custom attributes like data-* and aria-*
}

type OwnerState = Pick<GridRowProps, 'selected'> & {
  editable: boolean;
  editing: boolean;
  isLastVisible: boolean;
  classes?: DataGridProcessedProps['classes'];
  rowHeight: GridRowProps['rowHeight'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { editable, editing, selected, isLastVisible, rowHeight, classes } = ownerState;
  const slots = {
    root: [
      'row',
      selected && 'selected',
      editable && 'row--editable',
      editing && 'row--editing',
      isLastVisible && 'row--lastVisible',
      rowHeight === 'auto' && 'row--dynamicHeight',
    ],
    pinnedLeft: ['pinnedLeft'],
    pinnedRight: ['pinnedRight'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function EmptyCell({ width }: { width: number }) {
  if (!width) {
    return null;
  }

  const style = { width };

  return <div className={`${gridClasses.cell} ${gridClasses.withBorderColor}`} style={style} />; // TODO change to .MuiDataGrid-emptyCell or .MuiDataGrid-rowFiller
}

const GridRow = React.forwardRef<HTMLDivElement, GridRowProps>(function GridRow(props, refProp) {
  const {
    selected,
    rowId,
    row,
    index,
    style: styleProp,
    rowHeight,
    className,
    visibleColumns,
    renderedColumns,
    pinnedColumns,
    containerWidth,
    firstColumnToRender,
    lastColumnToRender,
    isLastVisible = false,
    focusedCellColumnIndexNotInRange,
    isNotVisible,
    focusedCell,
    tabbableCell,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave,
    onMouseOut,
    onMouseOver,
    ...other
  } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const rootProps = useGridRootProps();
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);
  const handleRef = useForkRef(ref, refProp);
  const rowNode = apiRef.current.getRowNode(rowId);

  const ariaRowIndex = index + headerGroupingMaxDepth + 2; // 1 for the header row and 1 as it's 1-based

  const ownerState = {
    selected,
    isLastVisible,
    classes: rootProps.classes,
    editing: apiRef.current.getRowMode(rowId) === GridRowModes.Edit,
    editable: rootProps.editMode === GridEditModes.Row,
    rowHeight,
  };

  const classes = useUtilityClasses(ownerState);

  React.useLayoutEffect(() => {
    if (rowHeight === 'auto' && ref.current && typeof ResizeObserver === 'undefined') {
      // Fallback for IE
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, ref.current.clientHeight);
    }
  }, [apiRef, rowHeight, rowId]);

  React.useLayoutEffect(() => {
    if (currentPage.range) {
      // The index prop is relative to the rows from all pages. As example, the index prop of the
      // first row is 5 if `paginationModel.pageSize=5` and `paginationModel.page=1`. However, the index used by the virtualization
      // doesn't care about pagination and considers the rows from the current page only, so the
      // first row always has index=0. We need to subtract the index of the first row to make it
      // compatible with the index used by the virtualization.
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
      // pinned rows are not part of the visible rows
      if (rowIndex != null) {
        apiRef.current.unstable_setLastMeasuredRowIndex(rowIndex);
      }
    }

    const rootElement = ref.current;
    const hasFixedHeight = rowHeight !== 'auto';
    if (!rootElement || hasFixedHeight || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      const height =
        entry.borderBoxSize && entry.borderBoxSize.length > 0
          ? entry.borderBoxSize[0].blockSize
          : entry.contentRect.height;
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, height);
    });

    resizeObserver.observe(rootElement);

    return () => resizeObserver.disconnect();
  }, [apiRef, currentPage.range, index, rowHeight, rowId]);

  const publish = React.useCallback(
    (
        eventName: keyof GridRowEventLookup,
        propHandler: React.MouseEventHandler<HTMLDivElement> | undefined,
      ): React.MouseEventHandler<HTMLDivElement> =>
      (event) => {
        // Ignore portal
        // The target is not an element when triggered by a Select inside the cell
        // See https://github.com/mui/material-ui/issues/10534
        if (
          (event.target as any).nodeType === 1 &&
          !event.currentTarget.contains(event.target as Element)
        ) {
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

  const rowReordering = (rootProps as any).rowReordering as boolean;

  const sizes = useGridSelector(
    apiRef,
    () => ({ ...apiRef.current.unstable_getRowInternalSizes(rowId) }),
    objectShallowCompare,
  );

  let minHeight = rowHeight;
  if (minHeight === 'auto' && sizes) {
    const numberOfBaseSizes = 1;
    const maximumSize = sizes.baseCenter ?? 0;

    if (maximumSize > 0 && numberOfBaseSizes > 1) {
      minHeight = maximumSize;
    }
  }

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
      minHeight,
    };

    if (sizes?.spacingTop) {
      const property = rootProps.rowSpacingType === 'border' ? 'borderTopWidth' : 'marginTop';
      rowStyle[property] = sizes.spacingTop;
    }

    if (sizes?.spacingBottom) {
      const property = rootProps.rowSpacingType === 'border' ? 'borderBottomWidth' : 'marginBottom';
      let propertyValue = rowStyle[property];
      // avoid overriding existing value
      if (typeof propertyValue !== 'number') {
        propertyValue = parseInt(propertyValue || '0', 10);
      }
      propertyValue += sizes.spacingBottom;
      rowStyle[property] = propertyValue;
    }

    return rowStyle;
  }, [isNotVisible, rowHeight, styleProp, minHeight, sizes, rootProps.rowSpacingType]);

  const rowClassNames = apiRef.current.unstable_applyPipeProcessors('rowClassName', [], rowId);

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
    pinnedPosition = PinnedPosition.NONE,
  ) => {
    const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(
      rowId,
      indexRelativeToAllColumns,
    );

    if (!cellColSpanInfo || cellColSpanInfo.spannedByColSpan) {
      return null;
    }

    const pinnedOffset =
      pinnedPosition === PinnedPosition.LEFT
        ? columnPositions[indexRelativeToAllColumns]
        : pinnedPosition === PinnedPosition.RIGHT
        ? columnsTotalWidth - columnPositions[indexRelativeToAllColumns] - column.computedWidth
        : 0;

    if (rowNode?.type === 'skeletonRow') {
      const { width } = cellColSpanInfo.cellProps;
      const contentWidth = Math.round(randomNumber());

      return (
        <slots.skeletonCell
          key={column.field}
          width={width}
          contentWidth={contentWidth}
          field={column.field}
          align={column.align}
        />
      );
    }

    const { colSpan, width } = cellColSpanInfo.cellProps;

    const editCellState = editRowsState[rowId]?.[column.field] ?? null;
    const disableDragEvents =
      (disableColumnReorder && column.disableReorder) ||
      (!rowReordering &&
        !!sortModel.length &&
        treeDepth > 1 &&
        Object.keys(editRowsState).length > 0);

    let cellIsNotVisible = false;
    if (
      focusedCellColumnIndexNotInRange !== undefined &&
      visibleColumns[focusedCellColumnIndexNotInRange].field === column.field
    ) {
      cellIsNotVisible = true;
    }

    return (
      <slots.cell
        key={column.field}
        column={column}
        width={width}
        rowId={rowId}
        height={rowHeight}
        align={column.align || 'left'}
        colIndex={indexRelativeToAllColumns}
        colSpan={colSpan}
        disableDragEvents={disableDragEvents}
        editCellState={editCellState}
        isNotVisible={cellIsNotVisible}
        {...slotProps?.cell}
        pinnedOffset={pinnedOffset}
        pinnedPosition={pinnedPosition}
        sectionIndex={indexInSection}
        sectionLength={sectionLength}
      />
    );
  };

  /* Start of rendering */

  if (!rowNode) {
    return null;
  }

  const randomNumber = randomNumberBetween(10000, 20, 80);

  const leftCells = pinnedColumns.left.map((column, i) => {
    const indexRelativeToAllColumns = i;
    return getCell(
      column,
      i,
      indexRelativeToAllColumns,
      pinnedColumns.left.length,
      PinnedPosition.LEFT
    );
  });

  const rightCells = pinnedColumns.right.map((column, i) => {
    const indexRelativeToAllColumns = visibleColumns.length - pinnedColumns.right.length + i;
    return getCell(
      column,
      i,
      indexRelativeToAllColumns,
      pinnedColumns.right.length,
      PinnedPosition.RIGHT
    );
  });

  const cells = [] as React.ReactNode[];
  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];

    let indexRelativeToAllColumns = firstColumnToRender + i;

    if (focusedCellColumnIndexNotInRange !== undefined && focusedCell) {
      if (visibleColumns[focusedCellColumnIndexNotInRange].field === column.field) {
        indexRelativeToAllColumns = focusedCellColumnIndexNotInRange;
      } else {
        indexRelativeToAllColumns -= 1;
      }
    }

    cells.push(getCell(
      column,
      i,
      indexRelativeToAllColumns,
      renderedColumns.length,
    ));
  }

  const emptyCellWidth = containerWidth - columnsTotalWidth;

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
      ref={handleRef}
      data-id={rowId}
      data-rowindex={index}
      role="row"
      className={clsx(...rowClassNames, classes.root, className)}
      aria-rowindex={ariaRowIndex}
      aria-selected={selected}
      style={style}
      {...eventHandlers}
      {...other}
    >
      {leftCells}
      {cells}
      {rightCells.length > 0 && <div role="presentation" style={{ flex: '1' }} />}
      {rightCells}
      {emptyCellWidth > 0 && <EmptyCell width={emptyCellWidth} />}
    </div>
  );
});

GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  containerWidth: PropTypes.number.isRequired,
  firstColumnToRender: PropTypes.number.isRequired,
  /**
   * Determines which cell has focus.
   * If `null`, no cell in this row has focus.
   */
  focusedCell: PropTypes.string,
  focusedCellColumnIndexNotInRange: PropTypes.number,
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: PropTypes.number.isRequired,
  isLastVisible: PropTypes.bool,
  isNotVisible: PropTypes.bool,
  lastColumnToRender: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  renderedColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.object,
  rowHeight: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selected: PropTypes.bool.isRequired,
  /**
   * Determines which cell should be tabbable by having tabIndex=0.
   * If `null`, no cell in this row is in the tab sequence.
   */
  tabbableCell: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

const MemoizedGridRow = fastMemo(GridRow);

export { MemoizedGridRow as GridRow };
