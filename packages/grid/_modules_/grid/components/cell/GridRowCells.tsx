import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { GridCellIdentifier } from '../../hooks/features/focus/gridFocusState';
import {
  GridRowModel,
  GridCellParams,
  GridRowId,
  GridEditRowProps,
  GridStateColDef,
} from '../../models';
import { GridCell, GridCellProps } from './GridCell';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { isFunction } from '../../utils/utils';
import { gridClasses } from '../../gridClasses';

interface RowCellsProps {
  cellClassName?: string;
  columns: GridStateColDef[];
  extendRowFullWidth: boolean;
  firstColIdx: number;
  id: GridRowId;
  hasScrollX: boolean;
  hasScrollY: boolean;
  height: number;
  getCellClassName?: (params: GridCellParams) => string;
  lastColIdx: number;
  row: GridRowModel;
  rowIndex: number;
  showCellRightBorder: boolean;
  cellFocus: GridCellIdentifier | null;
  cellTabIndex: GridCellIdentifier | null;
  isSelected: boolean;
  editRowState?: GridEditRowProps;
}

function GridRowCellsRaw(props: RowCellsProps) {
  const {
    columns,
    firstColIdx,
    hasScrollX,
    hasScrollY,
    height,
    id,
    getCellClassName,
    lastColIdx,
    rowIndex,
    cellFocus,
    cellTabIndex,
    showCellRightBorder,
    isSelected,
    editRowState,
    cellClassName,
    ...other
  } = props;
  const apiRef = useGridApiContext();

  const cellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const colIndex = firstColIdx + colIdx;
    const isLastColumn = colIndex === columns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn
      ? showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    const cellParams: GridCellParams = apiRef.current.getCellParams(id, column.field);

    const classNames = [cellClassName];

    if (column.cellClassName) {
      classNames.push(
        clsx(
          isFunction(column.cellClassName)
            ? column.cellClassName(cellParams)
            : column.cellClassName,
        ),
      );
    }

    const editCellState = editRowState && editRowState[column.field];
    let cellComponent: React.ReactNode = null;

    if (editCellState == null && column.renderCell) {
      cellComponent = column.renderCell({ ...cellParams, api: apiRef.current });
      classNames.push(gridClasses['cell--withRenderer']);
    }

    if (editCellState != null && column.renderEditCell) {
      const params = { ...cellParams, ...editCellState, api: apiRef.current };
      cellComponent = column.renderEditCell(params);
      classNames.push(gridClasses['cell--editing']);
    }

    if (getCellClassName) {
      classNames.push(getCellClassName(cellParams));
    }

    const cellProps: GridCellProps = {
      value: cellParams.value,
      field: column.field,
      width: column.computedWidth,
      rowId: id,
      height,
      showRightBorder,
      formattedValue: cellParams.formattedValue,
      align: column.align || 'left',
      rowIndex,
      cellMode: cellParams.cellMode,
      colIndex,
      children: cellComponent,
      isEditable: cellParams.isEditable,
      isSelected,
      hasFocus: cellFocus !== null && cellFocus.id === id && cellFocus.field === column.field,
      tabIndex:
        cellTabIndex !== null &&
        cellTabIndex.id === id &&
        cellTabIndex.field === column.field &&
        cellParams.cellMode === 'view'
          ? 0
          : -1,
      className: clsx(classNames),
      ...other,
    };

    return cellProps;
  });

  return (
    <React.Fragment>
      {cellsProps.map((cellProps) => (
        <GridCell key={cellProps.field} {...cellProps} />
      ))}
    </React.Fragment>
  );
}

const GridRowCells = React.memo(GridRowCellsRaw);

GridRowCellsRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  cellClassName: PropTypes.string,
  cellFocus: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  cellTabIndex: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      align: PropTypes.oneOf(['center', 'left', 'right']),
      cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      computedWidth: PropTypes.number.isRequired,
      description: PropTypes.string,
      disableColumnMenu: PropTypes.bool,
      disableExport: PropTypes.bool,
      disableReorder: PropTypes.bool,
      editable: PropTypes.bool,
      field: PropTypes.string.isRequired,
      filterable: PropTypes.bool,
      filterOperators: PropTypes.arrayOf(
        PropTypes.shape({
          getApplyFilterFn: PropTypes.func.isRequired,
          InputComponent: PropTypes.elementType,
          InputComponentProps: PropTypes.object,
          label: PropTypes.string,
          value: PropTypes.string.isRequired,
        }),
      ),
      flex: PropTypes.number,
      headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
      headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      headerName: PropTypes.string,
      hide: PropTypes.bool,
      hideSortIcons: PropTypes.bool,
      minWidth: PropTypes.number,
      renderCell: PropTypes.func,
      renderEditCell: PropTypes.func,
      renderHeader: PropTypes.func,
      resizable: PropTypes.bool,
      sortable: PropTypes.bool,
      sortComparator: PropTypes.func,
      type: PropTypes.string,
      valueFormatter: PropTypes.func,
      valueGetter: PropTypes.func,
      valueOptions: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
          }),
          PropTypes.string,
        ]).isRequired,
      ),
      valueParser: PropTypes.func,
      width: PropTypes.number,
    }),
  ).isRequired,
  editRowState: PropTypes.object,
  extendRowFullWidth: PropTypes.bool.isRequired,
  firstColIdx: PropTypes.number.isRequired,
  getCellClassName: PropTypes.func,
  hasScrollX: PropTypes.bool.isRequired,
  hasScrollY: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isSelected: PropTypes.bool.isRequired,
  lastColIdx: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  showCellRightBorder: PropTypes.bool.isRequired,
} as any;

export { GridRowCells };
