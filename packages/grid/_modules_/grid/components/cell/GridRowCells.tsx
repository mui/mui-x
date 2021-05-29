import * as React from 'react';
import clsx from 'clsx';
import { GridCellIdentifier } from '../../hooks/features/focus/gridFocusState';
import {
  GridColumns,
  GridRowModel,
  GridCellParams,
  GridRowId,
  GridEditRowProps,
} from '../../models/index';
import { GridCell, GridCellProps } from './GridCell';
import { GridApiContext } from '../GridApiContext';
import { isFunction } from '../../utils/index';
import { gridDensityRowHeightSelector } from '../../hooks/features/density/densitySelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { GRID_CSS_CLASS_PREFIX } from '../../constants/cssClassesConstants';

interface RowCellsProps {
  cellClassName?: string;
  columns: GridColumns;
  extendRowFullWidth: boolean;
  firstColIdx: number;
  id: GridRowId;
  hasScrollX: boolean;
  hasScrollY: boolean;
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

export const GridRowCells = React.memo((props: RowCellsProps) => {
  const {
    columns,
    firstColIdx,
    hasScrollX,
    hasScrollY,
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
  const apiRef = React.useContext(GridApiContext);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

  const cellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const colIndex = firstColIdx + colIdx;
    const isLastColumn = colIndex === columns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn
      ? showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    const cellParams: GridCellParams = apiRef!.current.getCellParams(id, column.field);

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
      cellComponent = column.renderCell(cellParams);
      classNames.push(`${GRID_CSS_CLASS_PREFIX}-cellWithRenderer`);
    }

    if (editCellState != null && column.renderEditCell) {
      const params = { ...cellParams, ...editCellState };
      cellComponent = column.renderEditCell(params);
      classNames.push(`${GRID_CSS_CLASS_PREFIX}-cellEditing`);
    }

    if (getCellClassName) {
      classNames.push(getCellClassName(cellParams));
    }

    const cellProps: GridCellProps = {
      value: cellParams.value,
      field: column.field,
      width: column.width!,
      rowId: id,
      height: rowHeight,
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
        cellTabIndex !== null && cellTabIndex.id === id && cellTabIndex.field === column.field
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
});
GridRowCells.displayName = 'GridRowCells';
