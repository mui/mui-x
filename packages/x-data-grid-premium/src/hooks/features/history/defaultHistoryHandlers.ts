import type { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  gridVisibleRowsSelector,
  gridVisibleColumnFieldsSelector,
  gridColumnFieldsSelector,
} from '@mui/x-data-grid-pro';
import { getRowIndexRelativeToAllRows } from '@mui/x-data-grid-pro/internals';
import type {
  GridCellEditStopParams,
  GridRowEditStopParams,
  GridEvents,
  GridRowModelReplace,
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

      const { rowIdToIndexMap } = gridVisibleRowsSelector(apiRef);

      // Check if row is in the current page
      if (!rowIdToIndexMap.has(id)) {
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
          rowIndex: getRowIndexRelativeToAllRows(apiRef, id),
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
          rowIndex: getRowIndexRelativeToAllRows(apiRef, id),
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

      const { rowIdToIndexMap } = gridVisibleRowsSelector(apiRef);

      // Check if row is in the current page
      if (!rowIdToIndexMap.has(id)) {
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
          rowIndex: getRowIndexRelativeToAllRows(apiRef, id),
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
          rowIndex: getRowIndexRelativeToAllRows(apiRef, id),
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
 * Create the default handler for clipboardPasteEnd events.
 */
export const createClipboardPasteHistoryHandler = (
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<GridClipboardPasteHistoryData> => {
  return {
    store: (params: GridClipboardPasteHistoryData) => params,
    validate: (data: GridClipboardPasteHistoryData, direction: 'undo' | 'redo') => {
      const { oldRows, newRows } = data;
      const updatedRowIds = Array.from(newRows.keys());

      // Check if any rows were updated
      if (updatedRowIds.length === 0) {
        return false;
      }

      // Check if all affected rows are still visible and have expected values
      const { rowIdToIndexMap } = gridVisibleRowsSelector(apiRef);

      for (let i = 0; i < updatedRowIds.length; i += 1) {
        const rowId = updatedRowIds[i];
        if (!rowIdToIndexMap.has(rowId)) {
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

      return true;
    },

    undo: async (data: GridClipboardPasteHistoryData) => {
      const { oldRows, newRows } = data;
      const oldRowsValues = Array.from(oldRows.values());

      const visibleColumns = apiRef.current.getVisibleColumns();

      // Focus the first affected cell
      if (oldRowsValues.length > 0 && visibleColumns.length > 0) {
        const columnOrder = gridColumnFieldsSelector(apiRef);

        // Since we undo, oldRowData is the new data that will be set and newRowData is the current row
        const firstOldRow = Array.from(newRows.values())[0];
        const [firstNewRowId, firstNewRow] = Array.from(oldRows.entries())[0];

        let differentFieldIndex = columnOrder.length - 1;
        // Find the first field that is different to set the focus on
        for (let i = 0; i < columnOrder.length; i += 1) {
          const field = columnOrder[i];
          if (!isDeepEqual(firstOldRow[field], firstNewRow[field])) {
            differentFieldIndex = i;
            break;
          }
        }

        // Restore all rows to their original state
        apiRef.current.updateRows(asReplaceUpdates(oldRowsValues));

        if (differentFieldIndex >= 0) {
          requestAnimationFrame(() => {
            const focusField = columnOrder[differentFieldIndex];
            const colIndex = apiRef.current.getColumnIndex(focusField);
            apiRef.current.setCellFocus(firstNewRowId, focusField);
            apiRef.current.scrollToIndexes({
              rowIndex: getRowIndexRelativeToAllRows(apiRef, firstNewRowId),
              // `differentFieldIndex` is an index into all columns, so a hidden column
              // before it would make it point past the visible columns. Resolve it to a
              // visible index and skip the horizontal scroll when the column is hidden.
              colIndex: colIndex === -1 ? undefined : colIndex,
            });
          });
        }
      }
    },

    redo: async (data: GridClipboardPasteHistoryData) => {
      const { oldRows, newRows } = data;
      const newRowsValues = Array.from(newRows.values());

      const visibleColumns = apiRef.current.getVisibleColumns();

      // Focus the first affected cell
      if (newRowsValues.length > 0 && visibleColumns.length > 0) {
        const columnOrder = gridColumnFieldsSelector(apiRef);

        const firstOldRow = Array.from(oldRows.values())[0];
        const [firstNewRowId, firstNewRow] = Array.from(newRows.entries())[0];

        let differentFieldIndex = columnOrder.length - 1;
        // Find the first field that is different to set the focus on
        for (let i = 0; i < columnOrder.length; i += 1) {
          const field = columnOrder[i];
          if (!isDeepEqual(firstOldRow[field], firstNewRow[field])) {
            differentFieldIndex = i;
            break;
          }
        }

        // Restore all rows to the pasted state
        apiRef.current.updateRows(asReplaceUpdates(newRowsValues));

        if (differentFieldIndex >= 0) {
          requestAnimationFrame(() => {
            const focusField = columnOrder[differentFieldIndex];
            const colIndex = apiRef.current.getColumnIndex(focusField);
            apiRef.current.setCellFocus(firstNewRowId, focusField);
            apiRef.current.scrollToIndexes({
              rowIndex: getRowIndexRelativeToAllRows(apiRef, firstNewRowId),
              // `differentFieldIndex` is an index into all columns, so a hidden column
              // before it would make it point past the visible columns. Resolve it to a
              // visible index and skip the horizontal scroll when the column is hidden.
              colIndex: colIndex === -1 ? undefined : colIndex,
            });
          });
        }
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
