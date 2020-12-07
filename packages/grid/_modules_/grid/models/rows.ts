export type RowsProp = RowModel[];

/**
 * The key value object representing the data of a row.
 */
export interface RowModel extends ObjectWithId {
  [key: string]: any;
}

/**
 * The type of Id supported by the grid.
 */
export type RowId = string | number;

export interface ObjectWithId {
  id: RowId;
}

/**
 * An helper function allowing to check if [[RowData]] is valid.
 *
 * @param rowData Row as [[RowData]].
 * @returns a boolean
 */
export function checkRowHasId(
  rowData: RowModel | Partial<RowModel>,
  detailErrorMessage?: string,
): boolean {
  if (rowData.id == null) {
    throw new Error(
      [
        'Material-UI: The data grid component requires all rows to have a unique id property.',
        detailErrorMessage || 'A row was provided without id in the rows prop:',
        JSON.stringify(rowData),
      ].join('\n'),
    );
  }

  return true;
}
