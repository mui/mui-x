import { GridRowsProp } from '../../../models/gridRows';

export function useGridFreezeRows(rows: GridRowsProp) {
  if (process.env.NODE_ENV !== 'production') {
    Object.freeze(rows);
  }
}
