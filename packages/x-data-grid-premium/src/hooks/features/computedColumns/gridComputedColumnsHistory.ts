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
import type { GridComputedColumnsModel } from './gridComputedColumnsInterfaces';
import { gridComputedColumnsSelector } from './gridComputedColumnsSelectors';

/**
 * Where a computed column stood right before its definition was dropped, so that the
 * operation bringing the definition back puts the column where the user had it.
 */
interface GridComputedColumnSnapshot {
  field: string;
  /**
   * The index of the column among all the columns, hidden ones included.
   */
  index: number;
  /**
   * The width the user gave the column. Left out when the column was never resized:
   * the width of the definition (or of `computedColDef`) applies again.
   */
  width?: number;
  visible: boolean;
}

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
 */
export const createComputedColumnsHistoryHandler = (
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<GridComputedColumnsHistoryData> => {
  // The model the state held when the last change was seen. `store()` runs after the
  // state update, so the previous model has to come from here. A handler created before
  // the grid mounted (a custom `historyEventHandlers` map) reads it from the formula
  // feature on its first change: the event is published before the columns are hydrated,
  // so the runtime still holds the model it injected last.
  let lastModel: GridComputedColumnsModel | null =
    apiRef.current === null ? null : gridComputedColumnsSelector(apiRef);
  const getLastModel = (): GridComputedColumnsModel => {
    lastModel ??= getPrivateApi(apiRef).caches.formula?.computedColumns.model ?? [];
    return lastModel;
  };
  // With a controlled model, `setComputedColumns()` only calls `onComputedColumnsChange()`;
  // the state follows once the parent echoes the prop, after the undo/redo returned. That
  // echo is the operation itself, not a new step, and the columns to restore only exist
  // once it is hydrated.
  let pendingEcho: {
    model: GridComputedColumnsModel;
    columns: GridComputedColumnSnapshot[];
  } | null = null;

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
    const { pendingColumnIndexes } = getPrivateApi(apiRef).caches.computedColumns;
    for (const snapshot of columns) {
      pendingColumnIndexes.set(snapshot.field, snapshot.index);
    }

    const modelBefore = gridComputedColumnsSelector(apiRef);
    apiRef.current.setComputedColumns(model);
    const modelAfter = gridComputedColumnsSelector(apiRef);

    if (modelAfter === modelBefore && modelBefore !== model) {
      // Not applied: the model is controlled and the parent has not echoed it yet.
      pendingEcho = { model, columns };
      return;
    }
    lastModel = modelAfter;
    pendingEcho = null;
    restoreColumns(columns);
  };

  return {
    store: (model: GridComputedColumnsModel) => {
      const previousModel = getLastModel();
      lastModel = model;
      if (previousModel === model) {
        return null;
      }

      if (pendingEcho !== null) {
        const { model: expectedModel, columns } = pendingEcho;
        pendingEcho = null;
        if (model === expectedModel || isDeepEqual(model, expectedModel)) {
          // The event is published before the columns are hydrated: the columns to
          // restore appear with the `columnsChange` that follows.
          if (columns.length > 0) {
            const unsubscribe = apiRef.current.subscribeEvent('columnsChange', () => {
              unsubscribe();
              restoreColumns(columns);
            });
          }
          return null;
        }
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
