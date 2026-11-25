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
  /** The calls of the generation that did not end. */
  pending: number;
  /** The order of the last call that started. */
  lastCall: number;
  /** The order of the call whose result is in the state. */
  appliedCall: number;
  /** The props of the last write. */
  appliedProps: unknown;
  /** Changes when the result of the validation with `hasChanged: true` is in the state. */
  valueVersion: number;
}

/**
 * The `preProcessEditCellProps()` calls of each cell in edit mode.
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

const runCall = <T>(
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
  cell: GridProcessingPropsCell,
  hasChanged: boolean,
  validate: (hasChanged: boolean) => T | Promise<T>,
  apply: (props: T, isProcessingProps: boolean) => boolean,
): Promise<T | undefined> => {
  // Register the call before the validator runs, because the validator can edit the cell again
  const generation = cell.generation;
  const valueVersion = cell.valueVersion;
  cell.lastCall += 1;
  const order = cell.lastCall;
  cell.pending += 1;

  // The cell entry changes when the cell leaves edit mode
  const isStale = () =>
    lookup.get(String(id))?.get(field) !== cell || cell.generation !== generation;

  const end = () => {
    if (!isStale()) {
      cell.pending -= 1;
    }
  };

  let validation: Promise<T>;
  try {
    validation = Promise.resolve(validate(hasChanged));
  } catch (error) {
    end();
    throw error;
  }

  return validation.then(
    (props) => {
      if (isStale()) {
        return undefined;
      }
      cell.pending -= 1;

      if (!hasChanged && order < cell.appliedCall) {
        // A later call wrote a newer result
        const appliedProps = cell.appliedProps as T;
        if (cell.pending === 0 && !apply(appliedProps, false)) {
          return undefined;
        }
        return appliedProps;
      }

      if (!hasChanged && cell.valueVersion !== valueVersion) {
        // The props of this call miss the result of the validation of the value
        return runCall(lookup, id, field, cell, false, validate, apply);
      }

      // A later call wrote its result without the result of this validation of the value
      const shouldRunAgain = hasChanged && order < cell.appliedCall;
      if (!apply(props, shouldRunAgain || cell.pending > 0)) {
        return undefined;
      }
      cell.appliedCall = Math.max(cell.appliedCall, order);
      cell.appliedProps = props;
      if (hasChanged) {
        cell.valueVersion += 1;
      }
      return shouldRunAgain ? runCall(lookup, id, field, cell, false, validate, apply) : props;
    },
    (error) => {
      end();
      throw error;
    },
  );
};

/**
 * Runs a `preProcessEditCellProps()` call of a cell, then writes its result.
 * A call with `hasChanged: true` validates a new value, so the earlier calls of the cell become stale.
 * The calls never wait for each other, because a validator can wait for an edit of the same row.
 * A call whose props miss a newer result runs the validator again with `hasChanged: false`.
 * Resolves with the props in the state, or `undefined` when the call is stale or the cell left edit mode.
 */
export const processEditCellProps = <T>(
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
  hasChanged: boolean,
  validate: (hasChanged: boolean) => T | Promise<T>,
  apply: (props: T, isProcessingProps: boolean) => boolean,
): Promise<T | undefined> => {
  const rowLookup = getProcessingPropsRow(lookup, id);
  let cell = rowLookup.get(field);
  if (!cell) {
    cell = {
      generation: 0,
      pending: 0,
      lastCall: 0,
      appliedCall: 0,
      appliedProps: undefined,
      valueVersion: 0,
    };
    rowLookup.set(field, cell);
  }
  if (hasChanged) {
    cell.generation += 1;
    cell.pending = 0;
    cell.appliedCall = 0;
    cell.appliedProps = undefined;
    cell.valueVersion = 0;
  }
  return runCall(lookup, id, field, cell, hasChanged, validate, apply);
};
