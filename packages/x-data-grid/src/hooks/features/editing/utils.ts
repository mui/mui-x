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

interface GridProcessingPropsCall {
  validate: () => unknown;
  // Writes the props to the state, and returns `false` when the cell is not in edit mode
  apply: (props: any, isProcessingProps: boolean) => boolean;
  settle: (props: unknown) => void;
  fail: (error: unknown) => void;
  promise: Promise<unknown>;
}

interface GridProcessingPropsCell {
  generation: number;
  isRunning: boolean;
  /** The call that runs after the running call. The later calls of the same value join it. */
  queued: GridProcessingPropsCall | null;
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

/**
 * Returns `true` when a call of the cell runs, so a call of the same value waits for it.
 */
export const isProcessingPropsRunning = (
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
) => !!lookup.get(String(id))?.get(field)?.isRunning;

// The queued call has no use after a new value or the end of the edit mode
const releaseQueuedCall = (cell: GridProcessingPropsCell) => {
  cell.queued?.settle(undefined);
  cell.queued = null;
};

export const deleteProcessingProps = (
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field?: string,
) => {
  const rowLookup = lookup.get(String(id));
  if (!rowLookup) {
    return;
  }
  if (field === undefined) {
    rowLookup.forEach(releaseQueuedCall);
    lookup.delete(String(id));
    return;
  }
  const cell = rowLookup.get(field);
  if (cell) {
    releaseQueuedCall(cell);
    rowLookup.delete(field);
  }
  if (rowLookup.size === 0) {
    lookup.delete(String(id));
  }
};

const runCall = (
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
  cell: GridProcessingPropsCell,
  call: GridProcessingPropsCall,
  shouldThrow: boolean,
) => {
  const generation = cell.generation;
  cell.isRunning = true;

  // The cell entry changes when the cell leaves edit mode
  const isStale = () =>
    lookup.get(String(id))?.get(field) !== cell || cell.generation !== generation;

  const runNext = () => {
    if (isStale()) {
      return;
    }
    cell.isRunning = false;
    const next = cell.queued;
    if (next) {
      cell.queued = null;
      runCall(lookup, id, field, cell, next, false);
    }
  };

  let validation: Promise<unknown>;
  try {
    validation = Promise.resolve(call.validate());
  } catch (error) {
    runNext();
    if (shouldThrow) {
      throw error;
    }
    call.fail(error);
    return;
  }

  validation.then(
    (props) => {
      if (isStale()) {
        call.settle(undefined);
        return;
      }
      try {
        call.settle(call.apply(props, cell.queued !== null) ? props : undefined);
      } catch (error) {
        call.fail(error);
      } finally {
        // The next call starts after this result is in the state
        runNext();
      }
    },
    (error) => {
      runNext();
      call.fail(error);
    },
  );
};

/**
 * Runs a `preProcessEditCellProps()` call of a cell, then applies its result.
 * A call with `hasChanged: true` validates a new value, so the earlier calls of the cell become stale.
 * A call with `hasChanged: false` runs after the running call of the same value, so it gets the latest props.
 * Resolves with the applied props, or `undefined` when the call is stale or the cell left edit mode.
 */
export const processEditCellProps = <T>(
  lookup: GridProcessingPropsLookup,
  id: GridRowId,
  field: string,
  hasChanged: boolean,
  validate: () => T | Promise<T>,
  apply: (props: T, isProcessingProps: boolean) => boolean,
): Promise<T | undefined> => {
  const rowLookup = getProcessingPropsRow(lookup, id);
  let cell = rowLookup.get(field);
  if (!cell) {
    cell = { generation: 0, isRunning: false, queued: null };
    rowLookup.set(field, cell);
  }
  if (hasChanged) {
    cell.generation += 1;
    cell.isRunning = false;
    releaseQueuedCall(cell);
  }

  // The calls of the same value that wait share one call, because they all read the latest props
  if (cell.queued) {
    cell.queued.validate = validate;
    cell.queued.apply = apply;
    return cell.queued.promise as Promise<T | undefined>;
  }

  let settle!: (props: unknown) => void;
  let fail!: (error: unknown) => void;
  const promise = new Promise<unknown>((resolve, reject) => {
    settle = resolve;
    fail = reject;
  });
  const call: GridProcessingPropsCall = { validate, apply, settle, fail, promise };

  if (cell.isRunning) {
    cell.queued = call;
  } else {
    runCall(lookup, id, field, cell, call, true);
  }
  return promise as Promise<T | undefined>;
};
