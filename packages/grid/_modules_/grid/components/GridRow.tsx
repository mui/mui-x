/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { GridEvents } from '../constants/eventsConstants';
import { GridRowId, GridRowData } from '../models/gridRows';
import { GridEditModes, GridRowModes, GridEditRowsModel } from '../models/gridEditRowModel';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { composeClasses } from '../utils/material-ui-utils';
import { getDataGridUtilityClass, gridClasses } from '../gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../GridComponentProps';
import { GridStateColDef } from '../models/colDef/gridColDef';
import { GridCellIdentifier } from '../hooks/features/focus/gridFocusState';
import { GridScrollBarState } from '../models/gridContainerProps';
import { gridColumnsMetaSelector } from '../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../hooks/utils/useGridSelector';

export interface GridRowProps {
  rowId: GridRowId;
  selected: boolean;
  index: number;
  rowHeight: number;
  containerWidth: number;
  row: GridRowData;
  firstColumnToRender: number;
  lastColumnToRender: number;
  visibleColumns: GridStateColDef[];
  renderedColumns: GridStateColDef[];
  cellFocus: GridCellIdentifier | null;
  cellTabIndex: GridCellIdentifier | null;
  editRowsState: GridEditRowsModel;
  scrollBarState: GridScrollBarState;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
}

type OwnerState = Pick<GridRowProps, 'selected'> & {
  editable: boolean;
  editing: boolean;
  classes?: GridComponentProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { editable, editing, selected, classes } = ownerState;

  const slots = {
    root: ['row', selected && 'selected', editable && 'row--editable', editing && 'row--editing'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const EmptyCell = ({ width, height }) => {
  if (!width || !height) {
    return null;
  }

  const style = { width, height };

  return <div className="MuiDataGrid-cell" style={style} />; // TODO change to .MuiDataGrid-emptyCell or .MuiDataGrid-rowFiller
};

function GridRow(props: React.HTMLAttributes<HTMLDivElement> & GridRowProps) {
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
    containerWidth,
    firstColumnToRender,
    lastColumnToRender,
    cellFocus,
    cellTabIndex,
    editRowsState,
    scrollBarState, // to be removed
    onClick,
    onDoubleClick,
    ...other
  } = props;
  const ariaRowIndex = index + 2; // 1 for the header row and 1 as it's 1-based
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const rowNode = apiRef.current.UNSTABLE_getRowNode(rowId);

  const ownerState = {
    selected,
    classes: rootProps.classes,
    editing: apiRef.current.getRowMode(rowId) === GridRowModes.Edit,
    editable: rootProps.editMode === GridEditModes.Row,
  };

  const classes = useUtilityClasses(ownerState);

  const publish = React.useCallback(
    (eventName: string, propHandler: any) => (event: React.MouseEvent) => {
      // Ignore portal
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
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

  const style = {
    maxHeight: rowHeight,
    minHeight: rowHeight,
    ...styleProp,
  };

  const rowClassName =
    typeof rootProps.getRowClassName === 'function' &&
    rootProps.getRowClassName(apiRef.current.getRowParams(rowId));

  const cells: JSX.Element[] = [];

  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];
    const indexRelativeToAllColumns = firstColumnToRender + i;

    const isLastColumn = indexRelativeToAllColumns === visibleColumns.length - 1;
    const removeLastBorderRight =
      isLastColumn && scrollBarState.hasScrollX && !scrollBarState.hasScrollY;
    const showRightBorder = !isLastColumn
      ? rootProps.showCellRightBorder
      : !removeLastBorderRight && rootProps.disableExtendRowFullWidth;

    const cellParams = apiRef.current.getCellParams(rowId, column.field);

    const classNames: string[] = [];

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

    const skipRender = !column.shouldRenderAutoGeneratedRows && rowNode?.isAutoGenerated;

    if (editCellState == null && column.renderCell && !skipRender) {
      content = column.renderCell({ ...cellParams, api: apiRef.current });
      // TODO move to GridCell
      classNames.push(
        clsx(gridClasses['cell--withRenderer'], rootProps.classes?.['cell--withRenderer']),
      );
    }

    if (editCellState != null && column.renderEditCell && !skipRender) {
      const params = { ...cellParams, ...editCellState, api: apiRef.current };
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

    cells.push(
      <rootProps.components.Cell
        key={i}
        value={skipRender ? null : cellParams.value}
        field={column.field}
        width={column.computedWidth}
        rowId={rowId}
        height={rowHeight}
        showRightBorder={showRightBorder}
        formattedValue={skipRender ? null : cellParams.formattedValue}
        align={column.align || 'left'}
        cellMode={cellParams.cellMode}
        colIndex={indexRelativeToAllColumns}
        isEditable={cellParams.isEditable}
        hasFocus={hasFocus}
        tabIndex={tabIndex}
        className={clsx(classNames)}
        {...rootProps.componentsProps?.cell}
      >
        {content}
      </rootProps.components.Cell>,
    );
  }

  const emptyCellWidth = containerWidth - columnsMeta.totalWidth;

  return (
    <div
      data-id={rowId}
      data-rowindex={index}
      role="row"
      className={clsx(rowClassName, classes.root, className)}
      aria-rowindex={ariaRowIndex}
      aria-selected={selected}
      style={style}
      onClick={publish(GridEvents.rowClick, onClick)}
      onDoubleClick={publish(GridEvents.rowDoubleClick, onDoubleClick)}
      {...other}
    >
      {cells}
      {emptyCellWidth > 0 && <EmptyCell width={emptyCellWidth} height={rowHeight} />}
    </div>
  );
}

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
  index: PropTypes.number.isRequired,
  lastColumnToRender: PropTypes.number.isRequired,
  renderedColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  row: PropTypes.object.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  scrollBarState: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { GridRow };
