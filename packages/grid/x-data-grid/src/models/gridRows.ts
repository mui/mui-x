import type { GridKeyValue } from './colDef/gridColDef';

export type GridDefaultRowModel = { [key: string]: any };

export type GridRowsProp<R = GridDefaultRowModel> = Readonly<GridRowModel<R>[]>;

/**
 * @deprecated prefer GridRowModel.
 */
export type GridRowData<R = GridDefaultRowModel> = R;

/**
 * The key value object representing the data of a row.
 */
export type GridRowModel<R = GridDefaultRowModel> = R;

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
  groupingKey: GridKeyValue;
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

export type GridRowsLookup = Record<GridRowId, GridRowModel>;

/**
 * The type of Id supported by the grid.
 */
export type GridRowId = string | number;

export type GridRowEntry = { id: GridRowId; model: GridRowModel };

/**
 * The function to retrieve the id of a [[GridRowModel]].
 */
export type GridRowIdGetter = (row: GridRowModel) => GridRowId;

/**
 * An helper function to check if the id provided is valid.
 * @param {GridRowId} id Id as [[GridRowId]].
 * @param {GridRowModel | Partial<GridRowModel>} row Row as [[GridRowModel]].
 * @param {string} detailErrorMessage A custom error message to display for invalid IDs
 */
export function checkGridRowIdIsValid(
  id: GridRowId,
  row: GridRowModel | Partial<GridRowModel>,
  detailErrorMessage: string = 'A row was provided without id in the rows prop:',
) {
  if (id == null) {
    throw new Error(
      [
        'MUI: The data grid component requires all rows to have a unique `id` property.',
        'Alternatively, you can use the `getRowId` prop to specify a custom id for each row.',
        detailErrorMessage,
        JSON.stringify(row),
      ].join('\n'),
    );
  }
}
