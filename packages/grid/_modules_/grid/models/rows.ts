export type RowsProp = RowData[];
export type RowData = {[key: string]: any};

/**
 * The key value object representing the data of a row.
 */
export type RowModel = ObjectWithId & RowData;

/**
 * The type of Id supported by the grid.
 */
export type RowId = string | number;

/**
 * The function to retrieve the id of a [[RowModel]].
 */
export type RowIdGetter = (row: Partial<RowModel>)=> RowId;

export interface ObjectWithId {
  id: RowId;
}

/**
 * An helper function allowing to check if [[RowData]] is valid.
 *
 * @param row Row as [[RowData]].
 * @returns a boolean
 */
export function checkRowHasId(
  row: RowModel | Partial<RowModel>,
  getRowId: RowIdGetter,
  detailErrorMessage?: string,
): boolean {
  if (getRowId(row) == null) {
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
