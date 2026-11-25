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

interface GridProcessingPropsCell {
  generation: number;
  pending: number;
}

export type GridProcessingPropsLookup = Map<GridRowId, Map<string, GridProcessingPropsCell>>;

/**
 * Counts a pending `preProcessEditCellProps()` call of a cell.
 * A call with `hasChanged: true` validates a new value, so the earlier calls of the cell become stale.
 * Call the returned callback when the call resolves. A rejected call stops counting by itself.
 */
export const trackProcessingProps = (
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
  hasChanged: boolean,
  promise: Promise<unknown>,
) => {
  let rowLookup = lookup.get(id);
  if (!rowLookup) {
    rowLookup = new Map();
    lookup.set(id, rowLookup);
  }
  let cell = rowLookup.get(field);
  if (!cell) {
    cell = { generation: 0, pending: 0 };
    rowLookup.set(field, cell);
  }
  if (hasChanged) {
    cell.generation += 1;
    cell.pending = 0;
  }
  cell.pending += 1;

  const trackedCell = cell;
  const generation = cell.generation;

  const end = () => {
    // The cell entry changes when the cell leaves edit mode
    const isStale =
      lookup.get(id)?.get(field) !== trackedCell || trackedCell.generation !== generation;
    if (!isStale) {
      trackedCell.pending -= 1;
    }
    return { isStale, isProcessingProps: trackedCell.pending > 0 };
  };
  promise.catch(end);

  return end;
};
