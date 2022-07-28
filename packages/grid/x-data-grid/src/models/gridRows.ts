import type { GridKeyValue } from './colDef/gridColDef';

export type GridValidRowModel = { [key: string]: any };

export type GridRowsProp<R = any> = Readonly<GridRowModel<R>[]>;

/**
 * @deprecated prefer GridRowModel.
 */
export type GridRowData = GridValidRowModel;

/**
 * The key value object representing the data of a row.
 */
export type GridRowModel<R extends GridValidRowModel = any> = R;

export type GridUpdateAction = 'delete';

export interface GridRowModelUpdate extends GridRowModel {
  _action?: GridUpdateAction;
}

export interface GridRowTreeNodeConfig {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The id of the row children.
   * @default []
   */
  children?: GridRowId[];
  /**
   * The id of the footer
   */
  footerId?: GridRowId | null;
  /**
   * The row id of the parent (null if this row is a top level row).
   */
  parent: GridRowId | null;
  /**
   * Current expansion status of the row.
   * @default false
   */
  childrenExpanded?: boolean;
  /**
   * 0-based depth of the row in the tree.
   */
  depth: number;
  /**
   * The key used to group the children of this row.
   */
  groupingKey: GridKeyValue | null;
  /**
   * The field used to group the children of this row.
   * Is `null` if no field has been used to group the children of this row.
   */
  groupingField: string | null;
  /**
   * If `true`, this node has been automatically added to fill a gap in the tree structure.
   * @default false
   */
  isAutoGenerated?: boolean;
  /**
   * Position of the row among its sibling.
   * @default 'body'
   */
  position?: 'body' | 'footer';
  /**
   * If `true`, this row is pinned.
   * @default false
   */
  isPinned?: boolean;
}

/**
 * The grid rows total height and row positions.
 */
export interface GridRowsMeta {
  /**
   * The sum of all grid rows.
   */
  totalHeight: number;
  /**
   * The grid rows positions.
   */
  positions: number[];
}

export type GridRowTreeConfig = Record<GridRowId, GridRowTreeNodeConfig>;

export type GridRowsLookup<R extends GridValidRowModel = any> = Record<GridRowId, R>;

/**
 * The type of Id supported by the grid.
 */
export type GridRowId = string | number;

export interface GridRowEntry<R extends GridValidRowModel = any> {
  /**
   * The row id.
   */
  id: GridRowId;
  /**
   * The row model.
   */
  model: R;
}

/**
 * The function to retrieve the id of a [[GridRowModel]].
 */
export type GridRowIdGetter<R extends GridValidRowModel = any> = (row: R) => GridRowId;
