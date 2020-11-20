import * as React from 'react';
import { CellValue } from '../cell';
import { CellClassNamePropType, CellClassRules } from '../cellClass';
import { FilterOperator } from '../filterOperator';
import { CellParams, ValueFormatterParams, ValueGetterParams } from '../params/cellParams';
import { ColParams } from '../params/colParams';
import { ComparatorFn, SortDirection } from '../sortModel';
import { ColType, NativeColTypes } from './colType';

/**
 * Alignement used in position elements in Cells.
 */
export type Alignement = 'left' | 'right' | 'center';

/**
 * Column Definition interface.
 */
export interface ColDef {
  /**
   * The column identifier. It's used to map with [[RowData]] values.
   */
  field: string;
  /**
   * The title of the column rendered in the column header cell.
   */
  headerName?: string;
  /**
   * The description of the column rendered as tooltip if the column header name is not fully displayed.
   */
  description?: string;
  /**
   * Set the width of the column.
   * @default 100
   */
  width?: number;
  /**
   * If set, it indicates that a column has fluid width. Range [0, ∞].
   */
  flex?: number;
  /**
   * If `true`, hide the column.
   * @default false;
   */
  hide?: boolean;
  /**
   * If `true`, the column is sortable.
   * @default true
   */
  sortable?: boolean;
  /**
   * If `true`, the column is resizable.
   * @default true
   */
  resizable?: boolean;
  /**
   * A comparator function used to sort rows.
   */
  sortComparator?: ComparatorFn;
  /**
   * Sort the rows in a specific direction.
   */
  sortDirection?: SortDirection;
  /**
   * If multiple columns are sorted, this setting allows to order the columns sorting sequence.
   */
  sortIndex?: number;
  /**
   * Type allows to merge this object with a default definition [[ColDef]].
   * @default string
   */
  type?: ColType;
  /**
   * Allows to align the column values in cells.
   */
  align?: Alignement;
  /**
   * Function that allows to get a specific data instead of field to render in the cell.
   * @param params
   */
  valueGetter?: (params: ValueGetterParams) => CellValue;
  /**
   * Function that allows to apply a formatter before rendering its value.
   * @param params
   */
  valueFormatter?: (params: ValueFormatterParams) => CellValue;
  /**
   * Class name that will be added in cells for that column.
   */
  cellClassName?: CellClassNamePropType;
  /**
   * Set of CSS class rules that will be dynamically applied on cells.
   */
  cellClassRules?: CellClassRules;
  /**
   * Allows to override the component rendered as cell for this column.
   * @param params
   */
  renderCell?: (params: CellParams) => React.ReactElement;
  /**
   * Class name that will be added in the column header cell.
   */
  headerClassName?: string | string[];
  /**
   * Allows to render a component in the column header cell.
   * @param params
   */
  renderHeader?: (params: ColParams) => React.ReactElement;
  /**
   * Header cell element alignment.
   */
  headerAlign?: Alignement;
  /**
   * Toggle the visibility of the sort icons.
   */
  hideSortIcons?: boolean;
  /**
   * Allows to disable the click event in cells.
   */
  disableClickEventBubbling?: boolean;
  /**
   * Allows to disable the column menu for this column.
   */
  disableColumnMenu?: boolean;
  /**
   * If `true`, the column is filterable.
   * @default true
   */
  filterable?: boolean;
  /**
   * Allows setting the filter operators for this column.
   */
  filterOperators?: FilterOperator[];
}

export type Columns = ColDef[];
export type ColTypeDef = Omit<ColDef, 'field'> & { extendType?: NativeColTypes };

/**
 * Meta Info about columns.
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

export const getInitialColumnsState = (): InternalColumns => ({
  visible: [],
  all: [],
  lookup: {},
  hasVisibleColumns: false,
  hasColumns: false,
  meta: { positions: [], totalWidth: 0 },
});
