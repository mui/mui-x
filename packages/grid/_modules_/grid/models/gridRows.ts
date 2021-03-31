export type GridRowsProp = GridRowData[];
export type GridRowData = { [key: string]: any };

/**
 * The key value object representing the data of a row.
 */
export type GridRowModel = GridObjectWithId & GridRowData;

export type GridUpdateAction = 'delete';

export interface GridRowModelUpdate extends GridRowData {
  _action?: GridUpdateAction;
}

/**
 * The type of Id supported by the grid.
 */
export type GridRowId = string | number;

/**
 * The function to retrieve the id of a [[GridRowData]].
 */
export type GridRowIdGetter = (row: GridRowData) => GridRowId;

export interface GridObjectWithId {
  id: GridRowId;
}

/**
 * An helper function allowing to check if [[GridRowData]] is valid.
 *
 * @param row Row as [[GridRowData]].
 * @returns a boolean
 */
export function checkGridRowHasId(
  row: GridRowModel | Partial<GridRowModel>,
  detailErrorMessage?: string,
): boolean {
  if (row.id == null) {
    throw new Error(
      [
        'Material-UI: The data grid component requires all rows to have a unique id property.',
        detailErrorMessage || 'A row was provided without id in the rows prop:',
        JSON.stringify(row),
      ].join('\n'),
    );
  }

  return true;
}
