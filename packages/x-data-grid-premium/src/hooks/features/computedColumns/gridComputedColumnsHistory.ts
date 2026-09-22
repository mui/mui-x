import type { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  gridColumnFieldsSelector,
  gridColumnLookupSelector,
  gridColumnVisibilityModelSelector,
} from '@mui/x-data-grid-pro';
import { unwrapPrivateAPI } from '@mui/x-data-grid-pro/internals';
import type { GridApiPremium, GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { GridHistoryEventHandler } from '../history/gridHistoryInterfaces';
import type {
  GridComputedColumnSnapshot,
  GridComputedColumnsModel,
} from './gridComputedColumnsInterfaces';
import { gridComputedColumnsSelector } from './gridComputedColumnsSelectors';

export interface GridComputedColumnsHistoryData {
  previousModel: GridComputedColumnsModel;
  nextModel: GridComputedColumnsModel;
  /**
   * The columns the change removed (in `previousModel`, not in `nextModel`), restored by
   * an undo. Captured when the change is stored and refreshed each time a redo removes
   * them again, so a column moved after an undo comes back where the user left it.
   */
  removedColumns: GridComputedColumnSnapshot[];
  /**
   * The columns the change added (in `nextModel`, not in `previousModel`), restored by a
   * redo. They do not exist yet when the change is stored: captured when an undo removes
   * them.
   */
  addedColumns: GridComputedColumnSnapshot[];
}

const getFields = (model: GridComputedColumnsModel): Set<string> =>
  new Set(model.map((definition) => definition.field));

/**
 * The private API carries the caches. The default handlers already receive the private
 * ref (typed as the public one); a handler created from a public `apiRef` unwraps it.
 */
const getPrivateApi = (apiRef: RefObject<GridApiPremium>): GridPrivateApiPremium =>
  unwrapPrivateAPI<GridPrivateApiPremium, GridApiPremium>(apiRef.current) ??
  (apiRef.current as unknown as GridPrivateApiPremium);

/**
 * Snapshots the computed columns of `from` that `to` does not define, as they stand in
 * the columns state now. Definitions the grid never injected (a field taken by a data
 * column, or an unavailable feature) have no column to capture.
 */
function captureColumns(
  apiRef: RefObject<GridApiPremium>,
  from: GridComputedColumnsModel,
  to: GridComputedColumnsModel,
): GridComputedColumnSnapshot[] {
  const keptFields = getFields(to);
  const lookup = gridColumnLookupSelector(apiRef);
  const orderedFields = gridColumnFieldsSelector(apiRef);
  const visibilityModel = gridColumnVisibilityModelSelector(apiRef);

  const snapshots: GridComputedColumnSnapshot[] = [];
  for (const definition of from) {
    const { field } = definition;
    const column = lookup[field];
    if (keptFields.has(field) || column?.computed !== true) {
      continue;
    }
    snapshots.push({
      field,
      index: orderedFields.indexOf(field),
      width: column.hasBeenResized ? column.width : undefined,
      visible: visibilityModel[field] !== false,
    });
  }
  return snapshots;
}

/**
 * Create the default handler for `computedColumnsChange` events.
 * Every change of the model is one step: adding, editing or removing a definition from the
 * panel, the column menu or the API. Undo and redo put the whole model back, then restore the
 * position, width and visibility of the columns the step brings back.
 *
 * The handler keeps no state of its own: `store()` runs after the state update, so the
 * previous model of a step is the one `setComputedColumns()` stashed in
 * `caches.computedColumns.previousModel` right before it, and the echo an undo/redo expects
 * from a controlled parent waits in `caches.computedColumns.historyEcho`. The history hook
 * may therefore re-create the handler at any time (a handler built before the grid mounted,
 * an inline `historyEventHandlers` map) and stop recording for a while (`historyStackSize`
 * set to 0) without losing the baseline of the next step.
 */
export const createComputedColumnsHistoryHandler = (
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<GridComputedColumnsHistoryData> => {
  const getCache = () => getPrivateApi(apiRef).caches.computedColumns;

  /**
   * Re-applies the width and the visibility of the columns the operation brought back
   * (the `hydrateColumns` pass has already inserted them at their index), and scrolls
   * to the first of them.
   */
  const restoreColumns = (columns: GridComputedColumnSnapshot[]) => {
    let firstRestoredField: string | null = null;
    for (const snapshot of columns) {
      const { field, width, visible } = snapshot;
      if (apiRef.current.getColumn(field)?.computed !== true) {
        continue;
      }
      firstRestoredField ??= field;
      if (width !== undefined) {
        apiRef.current.setColumnWidth(field, width);
      }
      if (!visible && gridColumnVisibilityModelSelector(apiRef)[field] !== false) {
        apiRef.current.setColumnVisibility(field, false);
      }
    }
    if (
      firstRestoredField !== null &&
      gridColumnVisibilityModelSelector(apiRef)[firstRestoredField] !== false
    ) {
      apiRef.current.scrollToIndexes({
        colIndex: apiRef.current.getColumnIndex(firstRestoredField),
      });
    }
  };

  /**
   * Puts `model` in place and brings `columns` back where they were. The `hydrateColumns`
   * pass that follows the state update inserts them at the pending index, controlled model
   * or not, so the position needs no second columns update.
   */
  const applyModel = (model: GridComputedColumnsModel, columns: GridComputedColumnSnapshot[]) => {
    const cache = getCache();
    for (const snapshot of columns) {
      cache.pendingColumnIndexes.set(snapshot.field, snapshot.index);
    }

    const modelBefore = gridComputedColumnsSelector(apiRef);
    apiRef.current.setComputedColumns(model);
    const modelAfter = gridComputedColumnsSelector(apiRef);

    if (modelAfter === modelBefore && modelBefore !== model) {
      // Not applied: the model is controlled and the parent has not echoed it yet. With a
      // controlled model, `setComputedColumns()` only calls `onComputedColumnsChange()`;
      // the state follows once the parent echoes the prop, and the columns to restore
      // only exist once that echo is hydrated. The echo may reach the history hook while
      // it still ignores every event as part of this operation (a parent updated from a
      // click is flushed at the first `await`), so `store()` cannot be the one finishing
      // it: the restoration waits for the `columnsChange` that hydrates the echoed model.
      const echo = { model, columns };
      cache.historyEcho = echo;
      const unsubscribe = apiRef.current.subscribeEvent('columnsChange', () => {
        if (cache.historyEcho !== echo) {
          // A later undo/redo asked for another model before the parent echoed this one,
          // or the parent published another model and `store()` recorded it.
          unsubscribe();
          return;
        }
        const currentModel = gridComputedColumnsSelector(apiRef);
        if (currentModel !== model && !isDeepEqual(currentModel, model)) {
          return;
        }
        unsubscribe();
        cache.historyEcho = null;
        restoreColumns(columns);
      });
      return;
    }
    cache.historyEcho = null;
    restoreColumns(columns);
  };

  return {
    store: (model: GridComputedColumnsModel) => {
      const cache = getCache();
      const previousModel = cache.previousModel ?? [];
      if (previousModel === model) {
        return null;
      }

      if (cache.historyEcho !== null) {
        // The echo is the operation itself, not a new step. Any other model means the
        // parent did not echo the operation (or normalized it): a step of its own.
        const { model: expectedModel } = cache.historyEcho;
        if (model === expectedModel || isDeepEqual(model, expectedModel)) {
          return null;
        }
        cache.historyEcho = null;
      }

      return {
        previousModel,
        nextModel: model,
        removedColumns: captureColumns(apiRef, previousModel, model),
        addedColumns: [],
      };
    },

    undo: (data: GridComputedColumnsHistoryData) => {
      data.addedColumns = captureColumns(apiRef, data.nextModel, data.previousModel);
      applyModel(data.previousModel, data.removedColumns);
    },

    redo: (data: GridComputedColumnsHistoryData) => {
      data.removedColumns = captureColumns(apiRef, data.previousModel, data.nextModel);
      applyModel(data.nextModel, data.addedColumns);
    },
  };
};
