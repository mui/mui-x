import * as React from 'react';
import { gridEditRowsStateSelector } from '../../hooks/features/rows/gridEditRowsSelector';
import {
  GridCellClassParams,
  GridColumns,
  GridRowModel,
  GridCellClassRules,
  GridCellParams,
  GridCellIndexCoordinates,
} from '../../models/index';
import { GridCell, GridCellProps } from './GridCell';
import { GridApiContext } from '../GridApiContext';
import { classnames, isFunction } from '../../utils/index';
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
  hasScroll: { y: boolean; x: boolean };
  lastColIdx: number;
  row: GridRowModel;
  rowIndex: number;
  scrollSize: number;
  showCellRightBorder: boolean;
  cellFocus: GridCellIndexCoordinates | null;
}

export const GridRowCells: React.FC<RowCellsProps> = React.memo((props) => {
  const {
    columns,
    firstColIdx,
    hasScroll,
    lastColIdx,
    row,
    rowIndex,
    scrollSize,
    cellFocus,
    showCellRightBorder,
  } = props;
  const apiRef = React.useContext(GridApiContext);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);

  const cellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const isLastColumn = firstColIdx + colIdx === columns.length - 1;
    const removeScrollWidth = isLastColumn && hasScroll.y && hasScroll.x;
    const width = removeScrollWidth ? column.width! - scrollSize : column.width!;
    const removeLastBorderRight = isLastColumn && hasScroll.x && !hasScroll.y;
    const showRightBorder = !isLastColumn
      ? showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    const cellParams: GridCellParams = apiRef!.current.getCellParams(row.id, column.field);

    let cssClassProp = { cssClass: '' };
    if (column.cellClassName) {
      if (!isFunction(column.cellClassName)) {
        cssClassProp = { cssClass: classnames(column.cellClassName) };
      } else {
        cssClassProp = { cssClass: column.cellClassName(cellParams) as string };
      }
    }

    if (column.cellClassRules) {
      const cssClass = applyCssClassRules(column.cellClassRules, cellParams);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} ${cssClass}` };
    }

    const editCellState = editRowsState[row.id] && editRowsState[row.id][column.field];
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

    const cellProps: GridCellProps & { children: any } = {
      value: cellParams.value,
      field: column.field,
      width,
      rowId: row.id,
      height: rowHeight,
      showRightBorder,
      formattedValue: cellParams.formattedValue,
      align: column.align || 'left',
      ...cssClassProp,
      rowIndex,
      cellMode: cellParams.cellMode,
      colIndex: cellParams.colIndex,
      children: cellComponent,
      isEditable: cellParams.isEditable,
      hasFocus:
        cellFocus !== null &&
        cellFocus.rowIndex === rowIndex &&
        cellFocus.colIndex === cellParams.colIndex,
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
