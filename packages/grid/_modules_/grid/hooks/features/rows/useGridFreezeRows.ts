import { GridRowsProp } from '../../../models/gridRows';

export function useGridFreezeRows(rows: GridRowsProp) {
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(rows);
  }
}
