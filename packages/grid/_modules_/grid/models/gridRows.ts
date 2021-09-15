export type GridRowsProp = Readonly<GridRowData[]>;
export type GridRowData = { [key: string]: any };

/**
 * The key value object representing the data of a row.
 */
export type GridRowModel = GridRowData;

export type GridUpdateAction = 'delete';

export interface GridRowModelUpdate extends GridRowData {
  _action?: GridUpdateAction;
}

export interface GridRowIdTreeNode {
  id: GridRowId;
  children: GridRowIdTree;
}

export type GridRowIdTree = { [nodeName: string]: GridRowIdTreeNode };

/**
 * The type of Id supported by the grid.
 */
export type GridRowId = string | number;

/**
 * The function to retrieve the id of a [[GridRowData]].
 */
export type GridRowIdGetter = (row: GridRowData) => GridRowId;

/**
 * An helper function to check if the id provided is valid.
 *
 * @param {GridRowId} id Id as [[GridRowId]].
 * @param {GridRowModel | Partial<GridRowModel>} row Row as [[GridRowData]].
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
        'Material-UI: The data grid component requires all rows to have a unique id property.',
        detailErrorMessage,
        JSON.stringify(row),
      ].join('\n'),
    );
  }
}
