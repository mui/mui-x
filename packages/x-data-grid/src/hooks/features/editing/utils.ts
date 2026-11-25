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
  /** Resolves when the last call of the generation ends. */
  last: Promise<void>;
}

/**
 * The pending `preProcessEditCellProps()` calls of each cell in edit mode.
 * The row keys are strings because the modes models give a string id after a row is removed.
 */
export type GridProcessingPropsLookup = Map<string, Map<string, GridProcessingPropsCell>>;

/**
 * Returns the entry of a row. The entry changes when the row leaves edit mode.
 */
export const getProcessingPropsRow = (lookup: GridProcessingPropsLookup, id: GridRowId) => {
  let rowLookup = lookup.get(String(id));
  if (!rowLookup) {
    rowLookup = new Map();
    lookup.set(String(id), rowLookup);
  }
  return rowLookup;
};

export const deleteProcessingProps = (
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field?: string,
) => {
  const rowLookup = lookup.get(String(id));
  if (field !== undefined) {
    rowLookup?.delete(field);
  }
  if (field === undefined || rowLookup?.size === 0) {
    lookup.delete(String(id));
  }
};

/**
 * Runs a `preProcessEditCellProps()` call of a cell, then applies its result.
 * A call with `hasChanged: true` validates a new value, so the earlier calls of the cell become stale.
 * A call with `hasChanged: false` runs after the pending calls of the same value, so the last result uses the latest props.
 * Resolves with the return value of `apply()`, or `undefined` when the call is stale.
 */
export const processEditCellProps = <T, R>(
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
  hasChanged: boolean,
  validate: () => T | Promise<T>,
  apply: (props: T, isProcessingProps: boolean) => R,
): Promise<R | undefined> => {
  const rowLookup = getProcessingPropsRow(lookup, id);
  let cell = rowLookup.get(field);
  if (!cell) {
    cell = { generation: 0, pending: 0, last: Promise.resolve() };
    rowLookup.set(field, cell);
  }
  if (hasChanged) {
    cell.generation += 1;
    cell.pending = 0;
  }

  // Register the call before the validator runs, because the validator can edit the cell again
  const trackedCell = cell;
  const generation = cell.generation;
  const previous = cell.pending > 0 ? cell.last : null;
  let markEnded!: () => void;
  cell.last = new Promise((resolve) => {
    markEnded = resolve;
  });
  cell.pending += 1;

  // The cell entry changes when the cell leaves edit mode
  const isStale = () =>
    lookup.get(String(id))?.get(field) !== trackedCell || trackedCell.generation !== generation;

  const end = () => {
    if (!isStale()) {
      trackedCell.pending -= 1;
    }
    markEnded();
  };

  const run = () => {
    if (isStale()) {
      markEnded();
      return Promise.resolve(undefined);
    }
    let validation: Promise<T>;
    try {
      validation = Promise.resolve(validate());
    } catch (error) {
      end();
      throw error;
    }
    return validation.then(
      (props) => {
        if (isStale()) {
          markEnded();
          return undefined;
        }
        trackedCell.pending -= 1;
        try {
          return apply(props, trackedCell.pending > 0);
        } finally {
          // The next call starts after this result is in the state
          markEnded();
        }
      },
      (error) => {
        end();
        throw error;
      },
    );
  };

  return previous ? previous.then(run) : run();
};
