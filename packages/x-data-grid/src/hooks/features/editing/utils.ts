import type { GridColDef } from '../../../models/colDef/gridColDef';
import type { GridRowId } from '../../../models/gridRows';

export const getDefaultCellValue = (colDef: GridColDef) => {
  switch (colDef.type) {
    case 'boolean':
      return false;
    case 'date':
    case 'dateTime':
    case 'number':
      return undefined;
    case 'singleSelect':
      return '';
    case 'string':
    default:
      return '';
  }
};

export type GridProcessingPropsLookup = Record<GridRowId, Record<string, { count: number }>>;

/**
 * Counts a `preProcessEditCellProps` call of a cell until the returned callback runs.
 * The callback returns `true` while other calls of the cell are still pending.
 */
export const trackProcessingProps = (
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
) => {
  if (!lookup[id]) {
    lookup[id] = {};
  }
  if (!lookup[id][field]) {
    lookup[id][field] = { count: 0 };
  }
  const counter = lookup[id][field];
  counter.count += 1;

  return () => {
    counter.count -= 1;
    return (lookup[id]?.[field]?.count ?? 0) > 0;
  };
};
