import { GridRowsProp } from '@mui/x-data-grid';

export interface GridPinnedRowsProp<R = any> {
  top?: GridRowsProp<R>;
  bottom?: GridRowsProp<R>;
}

export interface GridRowPinningApi {
  /**
   * Changes the pinned rows.
   * @param {GridPinnedRowsProp} pinnedRows An object containing the rows to pin.
   */
  unstable_setPinnedRows: (pinnedRows: GridPinnedRowsProp) => void;
}
