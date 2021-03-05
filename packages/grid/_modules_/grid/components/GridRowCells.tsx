import * as React from 'react';
import { gridEditRowsStateSelector } from '../hooks/features/rows/gridEditRowsSelector';
import {
  GridCellClassParams,
  GridColumns,
  GridRowModel,
  GridCellClassRules,
  GridCellParams,
  GridCellIndexCoordinates,
} from '../models';
import { GridCell, GridCellProps } from './GridCell';
import { GridApiContext } from './GridApiContext';
import { classnames, isFunction } from '../utils';
import { buildGridCellParams } from '../utils/paramsUtils';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { useGridSelector } from '../hooks/features/core/useGridSelector';

function applyCssClassRules(cellClassRules: GridCellClassRules, params: GridCellClassParams) {
  return Object.entries(cellClassRules).reduce((appliedCss, entry) => {
    const shouldApplyCss: boolean = isFunction(entry[1]) ? entry[1](params) : entry[1];
    appliedCss += shouldApplyCss ? `${entry[0]} ` : '';
    return appliedCss;
  }, '');
}

interface RowCellsProps {
  columns: GridColumns;
  domIndex: number;
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
    domIndex,
    firstColIdx,
    hasScroll,
    lastColIdx,
    row,
    rowIndex,
    scrollSize,
    cellFocus,
    showCellRightBorder,
  } = props;
  const api = React.useContext(GridApiContext);
  const rowHeight = useGridSelector(api, gridDensityRowHeightSelector);
  const editRowsState = useGridSelector(api, gridEditRowsStateSelector);

  const cellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const isLastColumn = firstColIdx + colIdx === columns.length - 1;
    const removeScrollWidth = isLastColumn && hasScroll.y && hasScroll.x;
    const width = removeScrollWidth ? column.width! - scrollSize : column.width!;
    const removeLastBorderRight = isLastColumn && hasScroll.x && !hasScroll.y;
    const showRightBorder = !isLastColumn
      ? showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    let value = row[column.field!];
    const cellParams: GridCellParams = buildGridCellParams({
      rowModel: row,
      colDef: column,
      rowIndex,
      colIndex: colIdx,
      value,
      api: api!.current!,
    });

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

    if (column.valueGetter) {
      // Value getter override the original value
      value = column.valueGetter(cellParams);
      cellParams.value = value;
    }

    let formattedValueProp = {};
    if (column.valueFormatter) {
      // TODO add formatted value to cellParams?
      formattedValueProp = { formattedValue: column.valueFormatter(cellParams) };
    }

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
      value,
      field: column.field,
      width,
      height: rowHeight,
      showRightBorder,
      ...formattedValueProp,
      align: column.align || 'left',
      ...cssClassProp,
      tabIndex: domIndex === 0 && colIdx === 0 ? 0 : -1,
      rowIndex,
      colIndex: colIdx + firstColIdx,
      children: cellComponent,
      isEditable: cellParams.isEditable,
      hasFocus:
        cellFocus !== null &&
        cellFocus.rowIndex === rowIndex &&
        cellFocus.colIndex === colIdx + firstColIdx,
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
