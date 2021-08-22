import { GridCellMode, GridCellValue } from '../gridCell';
import { GridRowId, GridRowModel } from '../gridRows';
import type { GridStateColDef } from '../colDef';
import { GridEditCellProps } from '../gridEditRowModel';

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export interface GridCellParams<T = GridCellValue> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The column field of the cell that triggered the event
   */
  field: string;
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: T;
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: T;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel<T>;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: GridStateColDef;
  /**
   * If true, the cell is editable.
   */
  isEditable?: boolean;
  /**
   * The mode of the cell.
   */
  cellMode: GridCellMode;
  /**
   * If true, the cell is the active element.
   */
  hasFocus: boolean;
  /**
   * the tabIndex value.
   */
  tabIndex: 0 | -1;
  /**
   * Get the cell value of a row and field.
   * @param id
   * @param field
   */
  getValue: (id: GridRowId, field: string) => T;
}

/**
 * GridCellParams containing api.
 */
export interface GridRenderCellParams<T = any> extends GridCellParams<T> {
  /**
   * GridApi that let you manipulate the grid.
   */
  api: any;
}

/**
 * GridEditCellProps containing api.
 */
export interface GridRenderEditCellParams extends GridEditCellProps {
  /**
   * GridApi that let you manipulate the grid.
   */
  api: any;
}

/**
 * Alias of GridRenderCellParams.
 */
export type GridValueGetterParams = Omit<GridRenderCellParams, 'formattedValue' | 'isEditable'>;

/**
 * Alias of GridRenderCellParams.
 */
export type GridValueFormatterParams = Omit<GridRenderCellParams, 'formattedValue' | 'isEditable'>;
