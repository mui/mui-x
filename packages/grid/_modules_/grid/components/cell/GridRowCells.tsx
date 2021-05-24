import * as React from 'react';
import clsx from 'clsx';
import { GridCellIdentifier } from '../../hooks/features/focus/gridFocusState';
import {
  GridCellClassParams,
  GridColumns,
  GridCellClassRules,
  GridCellParams,
  GridRowId,
  GridEditRowProps,
} from '../../models/index';
import { GridCell, GridCellProps } from './GridCell';
import { GridApiContext } from '../GridApiContext';
import { isFunction } from '../../utils/index';
import { gridDensityRowHeightSelector } from '../../hooks/features/density/densitySelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';

function applyCssClassRules(cellClassRules: GridCellClassRules, params: GridCellClassParams) {
  return Object.entries(cellClassRules).reduce((appliedCss, entry) => {
    const shouldApplyCss: boolean = isFunction(entry[1]) ? entry[1](params) : entry[1];
    appliedCss += shouldApplyCss ? `${entry[0]} ` : '';
    return appliedCss;
  }, '');
}

interface RowCellsProps {
  columns: GridColumns;
  extendRowFullWidth: boolean;
  firstColIdx: number;
  id: GridRowId;
  hasScrollX: boolean;
  hasScrollY: boolean;
  lastColIdx: number;
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
    lastColIdx,
    rowIndex,
    cellFocus,
    cellTabIndex,
    showCellRightBorder,
    isSelected,
    editRowState,
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

    let cssClassProp = { cssClass: '' };
    if (column.cellClassName) {
      if (!isFunction(column.cellClassName)) {
        cssClassProp = { cssClass: clsx(column.cellClassName) };
      } else {
        cssClassProp = { cssClass: column.cellClassName(cellParams) as string };
      }
    }

    if (column.cellClassRules) {
      const cssClass = applyCssClassRules(column.cellClassRules, cellParams);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} ${cssClass}` };
    }

    const editCellState = editRowState && editRowState[column.field];
    let cellComponent: React.ReactElement | null = null;

    if (editCellState == null && column.renderCell) {
      cellComponent = column.renderCell(cellParams);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} MuiDataGrid-cellWithRenderer` };
    }

    if (editCellState != null && column.renderEditCell) {
      const params = { ...cellParams, ...editCellState };
      cellComponent = column.renderEditCell(params);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} MuiDataGrid-cellEditing` };
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
      ...cssClassProp,
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
