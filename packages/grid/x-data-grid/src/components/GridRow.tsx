import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses, useForkRef } from '@mui/material';
import { GridRowEventLookup } from '../models/events';
import { GridRowId, GridRowModel } from '../models/gridRows';
import {
  GridEditModes,
  GridRowModes,
  GridEditRowsModel,
  GridCellModes,
} from '../models/gridEditRowModel';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass, gridClasses } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { GridStateColDef } from '../models/colDef/gridColDef';
import { GridCellIdentifier } from '../hooks/features/focus/gridFocusState';
import { gridColumnsTotalWidthSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { GridRowClassNameParams } from '../models/params/gridRowParams';
import { useGridVisibleRows } from '../hooks/utils/useGridVisibleRows';
import { findParentElementFromClassName } from '../utils/domUtils';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../colDef/gridCheckboxSelectionColDef';
import { GRID_ACTIONS_COLUMN_TYPE } from '../colDef/gridActionsColDef';
import { GridRenderEditCellParams } from '../models/params/gridCellParams';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../constants/gridDetailPanelToggleField';
import { gridSortModelSelector } from '../hooks/features/sorting/gridSortingSelector';
import { gridRowTreeDepthSelector } from '../hooks/features/rows/gridRowsSelector';
import { gridDensityHeaderGroupingMaxDepthSelector } from '../hooks/features/density/densitySelector';
import { randomNumberBetween } from '../utils/utils';
import { GridCellProps } from './cell/GridCell';

export interface GridRowProps {
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
  cellFocus: GridCellIdentifier | null;
  cellTabIndex: GridCellIdentifier | null;
  editRowsState: GridEditRowsModel;
  position: 'left' | 'center' | 'right';
  row?: GridRowModel;
  isLastVisible?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
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
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const EmptyCell = ({ width }: { width: number }) => {
  if (!width) {
    return null;
  }

  const style = { width };

  return <div className="MuiDataGrid-cell" style={style} />; // TODO change to .MuiDataGrid-emptyCell or .MuiDataGrid-rowFiller
};

const GridRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & GridRowProps
>(function GridRow(props, refProp) {
  const {
    selected,
    rowId,
    row,
    index,
    style: styleProp,
    position,
    rowHeight,
    className,
    visibleColumns,
    renderedColumns,
    containerWidth,
    firstColumnToRender,
    lastColumnToRender,
    cellFocus,
    cellTabIndex,
    editRowsState,
    isLastVisible = false,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave,
    ...other
  } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const rootProps = useGridRootProps();
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowTreeDepthSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridDensityHeaderGroupingMaxDepthSelector);
  const handleRef = useForkRef(ref, refProp);

  const ariaRowIndex = index + headerGroupingMaxDepth + 2; // 1 for the header row and 1 as it's 1-based
  const { hasScrollX, hasScrollY } = apiRef.current.getRootDimensions() ?? {
    hasScrollX: false,
    hasScrollY: false,
  };

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
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, ref.current.clientHeight, position);
    }
  }, [apiRef, rowHeight, rowId, position]);

  React.useLayoutEffect(() => {
    if (currentPage.range) {
      // The index prop is relative to the rows from all pages. As example, the index prop of the
      // first row is 5 if pageSize=5 and page=1. However, the index used by the virtualization
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
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, height, position);
    });

    resizeObserver.observe(rootElement);

    return () => resizeObserver.disconnect();
  }, [apiRef, currentPage.range, index, rowHeight, rowId, position]);

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
        if (column.type === GRID_ACTIONS_COLUMN_TYPE) {
          return;
        }
      }

      publish('rowClick', onClick)(event);
    },
    [apiRef, onClick, publish, rowId],
  );

  const getCell = React.useCallback(
    (
      column: GridStateColDef,
      cellProps: Pick<
        GridCellProps,
        'width' | 'colSpan' | 'showRightBorder' | 'indexRelativeToAllColumns'
      >,
    ) => {
      const cellParams = apiRef.current.getCellParams(rowId, column.field);

      const classNames: string[] = [];

      const disableDragEvents =
        (rootProps.disableColumnReorder && column.disableReorder) ||
        (!(rootProps as any).rowReordering &&
          !!sortModel.length &&
          treeDepth > 1 &&
          Object.keys(editRowsState).length > 0);

      if (column.cellClassName) {
        classNames.push(
          clsx(
            typeof column.cellClassName === 'function'
              ? column.cellClassName(cellParams)
              : column.cellClassName,
          ),
        );
      }

      const editCellState = editRowsState[rowId] ? editRowsState[rowId][column.field] : null;
      let content: React.ReactNode = null;

      if (editCellState == null && column.renderCell) {
        content = column.renderCell({ ...cellParams, api: apiRef.current });
        // TODO move to GridCell
        classNames.push(
          clsx(gridClasses['cell--withRenderer'], rootProps.classes?.['cell--withRenderer']),
        );
      }

      if (editCellState != null && column.renderEditCell) {
        let updatedRow = row;
        if (apiRef.current.unstable_getRowWithUpdatedValues) {
          // Only the new editing API has this method
          updatedRow = apiRef.current.unstable_getRowWithUpdatedValues(rowId, column.field);
        }

        const { changeReason, ...editCellStateRest } = editCellState;

        const params: GridRenderEditCellParams = {
          ...cellParams,
          row: updatedRow,
          ...editCellStateRest,
          api: apiRef.current,
        };

        content = column.renderEditCell(params);
        // TODO move to GridCell
        classNames.push(clsx(gridClasses['cell--editing'], rootProps.classes?.['cell--editing']));
      }

      if (rootProps.getCellClassName) {
        // TODO move to GridCell
        classNames.push(rootProps.getCellClassName(cellParams));
      }

      const hasFocus =
        cellFocus !== null && cellFocus.id === rowId && cellFocus.field === column.field;

      const tabIndex =
        cellTabIndex !== null &&
        cellTabIndex.id === rowId &&
        cellTabIndex.field === column.field &&
        cellParams.cellMode === 'view'
          ? 0
          : -1;

      return (
        <rootProps.components.Cell
          key={column.field}
          value={cellParams.value}
          field={column.field}
          width={cellProps.width}
          rowId={rowId}
          height={rowHeight}
          showRightBorder={cellProps.showRightBorder}
          formattedValue={cellParams.formattedValue}
          align={column.align || 'left'}
          cellMode={cellParams.cellMode}
          colIndex={cellProps.indexRelativeToAllColumns}
          isEditable={cellParams.isEditable}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
          className={clsx(classNames)}
          colSpan={cellProps.colSpan}
          disableDragEvents={disableDragEvents}
          {...rootProps.componentsProps?.cell}
        >
          {content}
        </rootProps.components.Cell>
      );
    },
    [
      apiRef,
      cellTabIndex,
      editRowsState,
      cellFocus,
      rootProps,
      row,
      rowHeight,
      rowId,
      treeDepth,
      sortModel.length,
    ],
  );

  const sizes = apiRef.current.unstable_getRowInternalSizes(rowId);

  let minHeight = rowHeight;
  if (minHeight === 'auto' && sizes) {
    let numberOfBaseSizes = 0;
    const maximumSize = Object.entries(sizes).reduce((acc, [key, size]) => {
      const isBaseHeight = /^base[A-Z]/.test(key);
      if (!isBaseHeight) {
        return acc;
      }
      numberOfBaseSizes += 1;
      if (size > acc) {
        return size;
      }
      return acc;
    }, 0);

    if (maximumSize > 0 && numberOfBaseSizes > 1) {
      minHeight = maximumSize;
    }
  }

  const style = {
    ...styleProp,
    maxHeight: rowHeight === 'auto' ? 'none' : rowHeight, // max-height doesn't support "auto"
    minHeight,
  };

  if (sizes?.spacingTop) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderTopWidth' : 'marginTop';
    style[property] = sizes.spacingTop;
  }

  if (sizes?.spacingBottom) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderBottomWidth' : 'marginBottom';
    let propertyValue = style[property];
    // avoid overriding existing value
    if (typeof propertyValue !== 'number') {
      propertyValue = parseInt(propertyValue || '0', 10);
    }
    propertyValue += sizes.spacingBottom;
    style[property] = propertyValue;
  }

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

  const randomNumber = randomNumberBetween(10000, 20, 80);
  const cells: JSX.Element[] = [];

  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];
    const indexRelativeToAllColumns = firstColumnToRender + i;

    const isLastColumn = indexRelativeToAllColumns === visibleColumns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn
      ? rootProps.showCellRightBorder
      : !removeLastBorderRight && rootProps.disableExtendRowFullWidth;

    const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(
      rowId,
      indexRelativeToAllColumns,
    );

    if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
      if (row) {
        const { colSpan, width } = cellColSpanInfo.cellProps;
        const cellProps = { width, colSpan, showRightBorder, indexRelativeToAllColumns };
        cells.push(getCell(column, cellProps));
      } else {
        const { width } = cellColSpanInfo.cellProps;
        const contentWidth = Math.round(randomNumber());

        cells.push(
          <rootProps.components.SkeletonCell
            key={column.field}
            width={width}
            contentWidth={contentWidth}
            field={column.field}
            align={column.align}
          />,
        );
      }
    }
  }

  const emptyCellWidth = containerWidth - columnsTotalWidth;

  const eventHandlers = row
    ? {
        onClick: publishClick,
        onDoubleClick: publish('rowDoubleClick', onDoubleClick),
        onMouseEnter: publish('rowMouseEnter', onMouseEnter),
        onMouseLeave: publish('rowMouseLeave', onMouseLeave),
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
      {cells}
      {emptyCellWidth > 0 && <EmptyCell width={emptyCellWidth} />}
    </div>
  );
});

GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  cellFocus: PropTypes.object,
  cellTabIndex: PropTypes.object,
  containerWidth: PropTypes.number.isRequired,
  editRowsState: PropTypes.object.isRequired,
  firstColumnToRender: PropTypes.number.isRequired,
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: PropTypes.number.isRequired,
  isLastVisible: PropTypes.bool,
  lastColumnToRender: PropTypes.number.isRequired,
  position: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
  renderedColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.object,
  rowHeight: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selected: PropTypes.bool.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { GridRow };
