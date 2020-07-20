import * as React from 'react';
import { ComparatorFn, SortDirection } from '../sortModel';
import { CellValue } from '../rows';
import { ColType } from './colType';
import { CellClassPropType, CellClassRules } from '../cellClass';
import { ColParams } from '../params/colParams';
import { CellParams, ValueFormatterParams, ValueGetterParams } from '../params/cellParams';

/**
 * Alignement used in position elements in Cells.
 */
export type Alignement = 'left' | 'right' | 'center';

/**
 * Column Definition interface.
 */
export interface ColDef {
  /**
   * String Column Identifier, used to map with [[RowData]] values
   */
  field: string;
  /**
   * The title of the column rendered in the column header cell
   */
  headerName?: string;
  /**
   * The description of the column rendered as tooltip if the column header name is not fully displayed
   */
  description?: string;
  /**
   * Set the width of the column
   * @default 100
   */
  width?: number;
  /**
   * Toggle the visibility of a column
   */
  hide?: boolean;
  /**
   * Make the column sortable
   * @default true
   */
  sortable?: boolean;
  /**
   * Make the column resizable
   * @default true
   */
  resizable?: boolean;
  /**
   * A comparator function used to sort rows
   */
  sortComparator?: ComparatorFn;
  /**
   * Sort the rows in a specific direction
   */
  sortDirection?: SortDirection;
  /**
   * If multiple columns are sorted, this setting allows to order the columns sorting sequence
   */
  sortIndex?: number;
  /**
   * Type allows to merge this object with a default definition [[ColDef]]
   * @default string
   */
  type?: ColType;
  /**
   * Allows to align the column values in cells
   */
  align?: Alignement;
  /**
   * Function that allows to get a specific data instead of field to render in the cell
   * @param params
   */
  valueGetter?: (params: ValueGetterParams) => CellValue;
  /**
   * Function that allows to apply a formatter before rendering its value
   * @param params
   */
  valueFormatter?: (params: ValueFormatterParams) => CellValue;
  /**
   * Css class that will be added in cells for that column
   */
  cellClass?: CellClassPropType;
  /**
   * Set of css class rules that will be dynamically applied on cells
   */
  cellClassRules?: CellClassRules;
  /**
   * Allows to override the component rendered as cell for this column
   * @param params
   */
  cellRenderer?: (params: CellParams) => React.ReactElement;
  /**
   * Css class that will be added in the column header cell
   */
  headerClass?: string | string[];
  /**
   * Allows to render a component in the column header cell
   * @param params
   */
  headerComponent?: (params: ColParams) => React.ReactElement;
  /**
   * Header cell element alignment
   */
  headerAlign?: Alignement;
  /**
   * Toggle the visibility of the sort icons
   */
  hideSortIcons?: boolean;
  /**
   * Allows to disable the click event in cells
   */
  disableClickEventBubbling?: boolean;
}
export type Columns = ColDef[];
export type ColTypeDef = Omit<ColDef, 'field'>;

/**
 * Meta Info about Columns.
 */
export interface ColumnsMeta {
  totalWidth: number;
  positions: number[];
}

export type ColumnLookup = { [field: string]: ColDef };

export interface InternalColumns {
  all: Columns;
  visible: Columns;
  meta: ColumnsMeta;
  hasColumns: boolean;
  hasVisibleColumns: boolean;
  lookup: ColumnLookup;
}
