import { GridRowId, GridRowsProp } from '@mui/x-data-grid';

export interface GridPinnedRowsProp<R = any> {
  top?: GridRowsProp<R>;
  bottom?: GridRowsProp<R>;
}

export interface GridRowPinningApi {
  /**
   * Returns a boolean value determining if the row is pinned.
   * @param {GridRowId} rowId The id of the row.
   * @returns {boolean} A boolean value determining if the row is pinned.
   */
  unstable_isRowPinned: (rowId: GridRowId) => boolean;
  /**
   * Changes the pinned rows.
   * @param {GridPinnedRowsProp} pinnedRows An object containing the rows to pin.
   */
  unstable_setPinnedRows: (pinnedRows: GridPinnedRowsProp) => void;
}
