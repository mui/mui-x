import type { GridValidRowModel } from '@mui/x-data-grid';

export interface GridClipboardPasteCreateRowsParams {
  /**
   * The number of rows to create.
   */
  count: number;
  /**
   * The pasted data that goes past the last row, split by rows and cells.
   * It has one item for each row to create.
   */
  data: string[][];
}

export interface GridClipboardPasteOptions<R extends GridValidRowModel = any> {
  /**
   * Creates rows for the pasted data that goes past the last row.
   * When it is set, a paste from a cell can add rows at the end of the grid.
   * The rows must have a unique id and can have default values.
   * The grid then writes the pasted values into the rows, and calls `processRowUpdate()` for each row.
   * Return fewer rows to paste less data. Throw an error or reject the promise to add no rows.
   * @param {GridClipboardPasteCreateRowsParams} params The params of the rows to create.
   * @returns {R[] | Promise<R[]>} The rows to add.
   */
  createRows?: (params: GridClipboardPasteCreateRowsParams) => R[] | Promise<R[]>;
}
