export type GridRowsProp = Readonly<GridRowData[]>;
export type GridRowData<RowType = { [key: string]: any }> = RowType;

/**
 * The key value object representing the data of a row.
 */
export type GridRowModel<RowType = any> = GridRowData<RowType>;

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

/**
 * An helper function to check if the id provided is valid.
 *
 * @param id Id as [[GridRowId]].
 * @param row Row as [[GridRowData]].
 * @returns a boolean
 */
export function checkGridRowIdIsValid(
  id: GridRowId,
  row: GridRowModel | Partial<GridRowModel>,
  detailErrorMessage?: string,
): boolean {
  if (id == null) {
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
