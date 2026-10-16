import type { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  gridVisibleRowsSelector,
  gridVisibleColumnFieldsSelector,
  gridExpandedSortedRowIndexLookupSelector,
} from '@mui/x-data-grid-pro';
import type {
  GridCellEditStopParams,
  GridRowEditStopParams,
  GridEvents,
  GridRowId,
  GridRowModelReplace,
  GridRowModelUpdate,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import type { GridApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type {
  GridHistoryEventHandler,
  GridCellEditHistoryData,
  GridRowEditHistoryData,
  GridClipboardPasteHistoryData,
} from './gridHistoryInterfaces';

/**
 * The row, when it has to be put back as the very object that was captured rather than
 * rebuilt from the values held in the history entry, and `undefined` otherwise.
 * Rebuilding is lossless for a plain object, but a class instance would come back without
 * its identity and without the `#private` state that no merge can carry over.
 */
const rowToRestore = (row: GridValidRowModel | undefined): GridValidRowModel | undefined => {
  if (!row) {
    return undefined;
  }
  const proto = Object.getPrototypeOf(row);
  return proto === Object.prototype || proto === null ? undefined : row;
};

/**
 * The index of the row for `scrollToIndexes()`, which expects an index over the rows of all pages.
 */
const getRowIndexToScroll = (apiRef: RefObject<GridApiPremium>, id: GridRowId) =>
  gridExpandedSortedRowIndexLookupSelector(apiRef)[id];

/**
 * The row as it stood when the entry was created. A cell entry cannot be undone from
 * `oldValue` alone once the row is a class instance, because writing the field back
 * rebuilds the row as a new object.
 */
const rowsBeforeEdit = new WeakMap<object, GridValidRowModel>();

/**
 * The row the edit actually stored. `processRowUpdate()` resolves long after
 * `cellEditStop`/`rowEditStop` have fired, so `store()` only ever sees the row the grid
 * computed optimistically, never the one that landed. By the time an entry is undone,
 * though, the row that landed is the row the grid holds — and a redo is only reachable
 * through an undo, so capturing it there is enough to put the same object back.
 */
const rowsAfterEdit = new WeakMap<object, GridValidRowModel>();

/**
 * Create the default handler for cellEditStop events.
 */
export const createCellEditHistoryHandler = (
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<GridCellEditHistoryData> => {
  return {
    store: (params: GridCellEditStopParams) => {
      const { id, field } = params;

      const oldRow = apiRef.current.getRow(id);
      const oldValue = oldRow[field];
      const newValue = apiRef.current.getRowWithUpdatedValues(id, field)[field];

      if (isDeepEqual(oldValue, newValue)) {
        return null;
      }

      const data = { id, field, oldValue, newValue };
      rowsBeforeEdit.set(data, oldRow);
      return data;
    },

    validate: (data: GridCellEditHistoryData, direction: 'undo' | 'redo') => {
      const { id, field, oldValue, newValue } = data;

      // Check if column is visible
      if (!gridVisibleColumnFieldsSelector(apiRef).includes(field)) {
        return false;
      }

      // Check if row is in the current page
      if (!gridVisibleRowsSelector(apiRef).rowIdToIndexMap.has(id)) {
        return false;
      }

      const row = apiRef.current.getRow(id);

      // Check if the value hasn't changed externally
      const currentValue = row[field];
      const expectedValue = direction === 'undo' ? newValue : oldValue;

      if (!isDeepEqual(currentValue, expectedValue)) {
        return false;
      }

      return true;
    },

    undo: async (data: GridCellEditHistoryData) => {
      const { id, field, oldValue } = data;

      const row = apiRef.current.getRow(id);
      if (row) {
        rowsAfterEdit.set(data, row);
      }
      const restoredRow = rowToRestore(rowsBeforeEdit.get(data));

      if (apiRef.current.state.props.dataSource?.updateRow) {
        await apiRef.current.dataSource.editRow({
          rowId: id,
          // `{ ...row, [field]: oldValue }` would hand `dataSource.updateRow()` a plain
          // object where the grid holds an instance. There is no way to rebuild an
          // instance with one field changed, so the whole captured row goes back.
          updatedRow: restoredRow ?? { ...row, [field]: oldValue },
          previousRow: row,
        });
      } else if (restoredRow) {
        apiRef.current.updateRows([{ _action: 'replace', row: restoredRow }]);
      } else {
        apiRef.current.updateRows([{ id, [field]: oldValue }]);
      }

      // Use `requestAnimationFrame` to ensure all undo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, field);
        apiRef.current.scrollToIndexes({
          rowIndex: getRowIndexToScroll(apiRef, id),
          colIndex: apiRef.current.getColumnIndex(field),
        });
      });
    },

    redo: async (data: GridCellEditHistoryData) => {
      const { id, field, newValue } = data;

      const row = apiRef.current.getRow(id);
      const restoredRow = rowToRestore(rowsAfterEdit.get(data));

      if (apiRef.current.state.props.dataSource?.updateRow) {
        await apiRef.current.dataSource.editRow({
          rowId: id,
          updatedRow: restoredRow ?? { ...row, [field]: newValue },
          previousRow: row,
        });
      } else if (restoredRow) {
        apiRef.current.updateRows([{ _action: 'replace', row: restoredRow }]);
      } else {
        apiRef.current.updateRows([{ id, [field]: newValue }]);
      }

      // Use `requestAnimationFrame` to ensure all redo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, field);
        apiRef.current.scrollToIndexes({
          rowIndex: getRowIndexToScroll(apiRef, id),
          colIndex: apiRef.current.getColumnIndex(field),
        });
      });
    },
  };
};

/**
 * Create the default handler for rowEditStop events.
 */
export const createRowEditHistoryHandler = (
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<GridRowEditHistoryData> => {
  return {
    store: (params: GridRowEditStopParams) => {
      const { id } = params;

      const oldRow = apiRef.current.getRow(id) || {};
      const newRow = apiRef.current.getRowWithUpdatedValues(id, '');

      if (isDeepEqual(oldRow, newRow)) {
        return null;
      }

      return {
        id,
        oldRow,
        newRow,
      };
    },

    validate: (data: GridRowEditHistoryData, direction: 'undo' | 'redo') => {
      const { id, oldRow, newRow } = data;

      // Check if row is in the current page
      if (!gridVisibleRowsSelector(apiRef).rowIdToIndexMap.has(id)) {
        return false;
      }

      const row = apiRef.current.getRow(id);

      // Check if modified fields haven't changed externally
      const expectedRow = direction === 'undo' ? newRow : oldRow;

      for (const field of Object.keys(expectedRow)) {
        if (!isDeepEqual(row[field], expectedRow[field])) {
          return false;
        }
      }

      return true;
    },

    undo: async (data: GridRowEditHistoryData) => {
      const { id, oldRow } = data;

      const row = apiRef.current.getRow(id);
      if (row) {
        rowsAfterEdit.set(data, row);
      }
      const restoredRow = rowToRestore(oldRow);

      if (apiRef.current.state.props.dataSource?.updateRow) {
        await apiRef.current.dataSource.editRow({
          rowId: id,
          updatedRow: oldRow,
          // `newRow` is what the grid computed while the row was in edit mode, always a
          // plain object. The row the grid holds is what the edit actually stored.
          previousRow: row ?? data.newRow,
        });
      } else if (restoredRow) {
        apiRef.current.updateRows([{ _action: 'replace', row: restoredRow }]);
      } else {
        apiRef.current.updateRows([{ id, ...oldRow }]);
      }

      // Use `requestAnimationFrame` to ensure all undo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, Object.keys(oldRow)[0]);
        apiRef.current.scrollToIndexes({
          rowIndex: getRowIndexToScroll(apiRef, id),
          colIndex: 0,
        });
      });
    },

    redo: async (data: GridRowEditHistoryData) => {
      const { id, newRow } = data;

      const row = apiRef.current.getRow(id);
      const restoredRow = rowToRestore(rowsAfterEdit.get(data));

      if (apiRef.current.state.props.dataSource?.updateRow) {
        await apiRef.current.dataSource.editRow({
          rowId: id,
          updatedRow: restoredRow ?? newRow,
          previousRow: row ?? data.oldRow,
        });
      } else if (restoredRow) {
        apiRef.current.updateRows([{ _action: 'replace', row: restoredRow }]);
      } else {
        apiRef.current.updateRows([{ id, ...newRow }]);
      }

      // Use `requestAnimationFrame` to ensure all redo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, Object.keys(newRow)[0]);
        apiRef.current.scrollToIndexes({
          rowIndex: getRowIndexToScroll(apiRef, id),
          colIndex: 0,
        });
      });
    },
  };
};

/**
 * Restores the captured rows as they are, instead of merging them into whatever is
 * stored now. Both sides of the history entry hold complete rows — the ones the grid
 * had before the paste and the ones `processRowUpdate()` returned — so there is nothing
 * to merge them into. A merge would build a copy of each row, dropping the identity and
 * the `#private` state that the paste itself preserved, and it could never undo a field
 * the paste added.
 */
const asReplaceUpdates = (rows: GridValidRowModel[]): GridRowModelReplace[] =>
  rows.map((row) => ({ _action: 'replace', row }));

/**
 * Focuses the first cell that is different between the two versions of a row.
 */
const focusFirstChangedCell = (
  apiRef: RefObject<GridApiPremium>,
  rowId: GridRowId,
  currentRow: GridValidRowModel,
  restoredRow: GridValidRowModel,
) => {
  // `scrollToIndexes()` expects the index of a visible column
  const columnOrder = gridVisibleColumnFieldsSelector(apiRef);
  if (columnOrder.length === 0) {
    return;
  }

  let differentFieldIndex = columnOrder.length - 1;
  // Find the first field that is different to set the focus on
  for (let i = 0; i < columnOrder.length; i += 1) {
    const field = columnOrder[i];
    if (!isDeepEqual(currentRow[field], restoredRow[field])) {
      differentFieldIndex = i;
      break;
    }
  }

  requestAnimationFrame(() => {
    // The row can be on another page, for example when the paste added rows
    if (!gridVisibleRowsSelector(apiRef).rowIdToIndexMap.has(rowId)) {
      return;
    }
    apiRef.current.setCellFocus(rowId, columnOrder[differentFieldIndex]);
    apiRef.current.scrollToIndexes({
      rowIndex: getRowIndexToScroll(apiRef, rowId),
      colIndex: differentFieldIndex,
    });
  });
};

/**
 * Create the default handler for clipboardPasteEnd events.
 */
export const createClipboardPasteHistoryHandler = (
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<GridClipboardPasteHistoryData> => {
  return {
    store: (params: GridClipboardPasteHistoryData) => {
      const { newRows, createdRows = new Map() } = params;
      // A paste that changed nothing has no undo step
      if (newRows.size === 0 && createdRows.size === 0) {
        return null;
      }

      // Keep only the rows that the paste changed.
      // Undo must not restore the rows that `processRowUpdate()` rejected.
      const oldRows = new Map<GridRowId, GridValidRowModel>();
      newRows.forEach((_, rowId) => {
        if (params.oldRows.has(rowId)) {
          oldRows.set(rowId, params.oldRows.get(rowId)!);
        }
      });
      return { oldRows, newRows, createdRows };
    },
    validate: (data: GridClipboardPasteHistoryData, direction: 'undo' | 'redo') => {
      const { oldRows, newRows, createdRows = new Map() } = data;
      const updatedRowIds = Array.from(newRows.keys());

      // Check if any rows were updated or created
      if (updatedRowIds.length === 0 && createdRows.size === 0) {
        return false;
      }

      // Check if all affected rows are still visible and have expected values
      // `rowIdToIndexMap` only has the rows of the current page
      const { rowIdToIndexMap } = gridVisibleRowsSelector(apiRef);
      // The created rows can move the updated rows to another page, for example when they sort first
      const checkVisibility = createdRows.size === 0;

      for (let i = 0; i < updatedRowIds.length; i += 1) {
        const rowId = updatedRowIds[i];
        if (checkVisibility && !rowIdToIndexMap.has(rowId)) {
          return false;
        }

        const row = apiRef.current.getRow(rowId);
        if (!row) {
          return false;
        }

        const expectedRow = direction === 'undo' ? newRows.get(rowId)! : oldRows.get(rowId)!;

        // Check if the row values match what we expect
        for (const field of Object.keys(expectedRow)) {
          if (!isDeepEqual(row[field], expectedRow[field])) {
            return false;
          }
        }
      }

      // The sorting, the filtering, or the pagination can move the created rows out of view.
      // Only check that they did not change.
      for (const [rowId, createdRow] of createdRows) {
        const row = apiRef.current.getRow(rowId);
        if (direction === 'redo') {
          // A redo adds the row again, so its id must not be in use
          if (row) {
            return false;
          }
        } else {
          if (!row) {
            return false;
          }
          // Also check the fields that were added later, because undo removes the whole row
          const fields = new Set([...Object.keys(createdRow), ...Object.keys(row)]);
          for (const field of fields) {
            if (!isDeepEqual(row[field], createdRow[field])) {
              return false;
            }
          }
        }
      }

      return true;
    },

    undo: async (data: GridClipboardPasteHistoryData) => {
      const { oldRows, newRows, createdRows } = data;

      // Restore all rows to their original state, and remove the created rows
      const updates: Array<GridRowModelUpdate | GridRowModelReplace> = asReplaceUpdates(
        Array.from(oldRows.values()),
      );
      createdRows?.forEach((row) => {
        // The whole row is given, so that `getRowId()` can find the id
        updates.push({ ...row, _action: 'delete' });
      });
      if (updates.length > 0) {
        apiRef.current.updateRows(updates);
      }

      // Focus the first affected cell
      const [rowId, newRow] = Array.from(newRows.entries())[0] ?? [];
      const oldRow = rowId === undefined ? undefined : oldRows.get(rowId);
      if (newRow && oldRow) {
        focusFirstChangedCell(apiRef, rowId!, newRow, oldRow);
      }
    },

    redo: async (data: GridClipboardPasteHistoryData) => {
      const { oldRows, newRows, createdRows } = data;

      // Restore all rows to the pasted state, and add the created rows again
      const updates: Array<GridRowModelUpdate | GridRowModelReplace> = asReplaceUpdates(
        Array.from(newRows.values()),
      );
      createdRows?.forEach((row) => {
        updates.push(row);
      });
      if (updates.length > 0) {
        apiRef.current.updateRows(updates);
      }

      // Focus the first affected cell
      const [rowId, newRow] = Array.from(newRows.entries())[0] ?? [];
      const oldRow = rowId === undefined ? undefined : oldRows.get(rowId);
      if (newRow && oldRow) {
        focusFirstChangedCell(apiRef, rowId!, oldRow, newRow);
      }
    },
  };
};

/**
 * Create the default history events map.
 */
export const createDefaultHistoryHandlers = (
  apiRef: RefObject<GridApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'columns' | 'isCellEditable' | 'dataSource'>,
) => {
  const handlers = {} as Record<
    GridEvents,
    | GridHistoryEventHandler<GridCellEditHistoryData>
    | GridHistoryEventHandler<GridRowEditHistoryData>
    | GridHistoryEventHandler<GridClipboardPasteHistoryData>
  >;

  const canHaveEditing = props.isCellEditable || props.columns.some((col) => col.editable);

  if (!canHaveEditing) {
    return handlers;
  }

  if (!props.dataSource || props.dataSource.updateRow) {
    handlers.cellEditStop = createCellEditHistoryHandler(apiRef);
    handlers.rowEditStop = createRowEditHistoryHandler(apiRef);
  }

  if (!props.dataSource) {
    handlers.clipboardPasteEnd = createClipboardPasteHistoryHandler(apiRef);
  }

  return handlers;
};
