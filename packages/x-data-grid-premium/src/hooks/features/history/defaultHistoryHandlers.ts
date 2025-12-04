import { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  type GridCellEditStopParams,
  type GridRowEditStopParams,
  type GridEvents,
} from '@mui/x-data-grid-pro';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  GridHistoryEventHandler,
  GridCellEditHistoryData,
  GridRowEditHistoryData,
  GridClipboardPasteHistoryData,
} from './gridHistoryInterfaces';

/**
 * Create the default handler for cellEditStop events.
 */
export const createCellEditHistoryHandler = (
  apiRef: RefObject<GridPrivateApiPremium>,
): GridHistoryEventHandler<GridCellEditHistoryData> => {
  return {
    store: (params: GridCellEditStopParams) => {
      const { id, field } = params;

      const oldValue = apiRef.current.getRow(id)[field];
      const newValue = apiRef.current.getRowWithUpdatedValues(id, field)[field];

      return {
        id,
        field,
        oldValue,
        newValue,
      };
    },

    validate: (data: GridCellEditHistoryData, direction: 'undo' | 'redo') => {
      const { id, field, oldValue, newValue } = data;

      // Check if row exists
      const row = apiRef.current.getRow(id);
      if (!row) {
        return false;
      }

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

      await apiRef.current.updateRows([{ id, [field]: oldValue }]);
      setTimeout(() => {
        apiRef.current.setCellFocus(id, field);
      }, 0);
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: apiRef.current.getColumnIndex(field),
      });
    },

    redo: async (data: GridCellEditHistoryData) => {
      const { id, field, newValue } = data;

      await apiRef.current.updateRows([{ id, [field]: newValue }]);
      setTimeout(() => {
        apiRef.current.setCellFocus(id, field);
      }, 0);
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: apiRef.current.getColumnIndex(field),
      });
    },
  };
};

/**
 * Create the default handler for rowEditStop events.
 */
export const createRowEditHistoryHandler = (
  apiRef: RefObject<GridPrivateApiPremium>,
): GridHistoryEventHandler<GridRowEditHistoryData> => {
  return {
    store: (params: GridRowEditStopParams) => {
      const { id } = params;

      const oldRow = apiRef.current.getRow(id) || {};
      const newRow = apiRef.current.getRowWithUpdatedValues(id, '');

      return {
        id,
        oldRow,
        newRow,
      };
    },

    validate: (data: GridRowEditHistoryData, direction: 'undo' | 'redo') => {
      const { id, oldRow, newRow } = data;

      // Check if row exists
      const row = apiRef.current.getRow(id);
      if (!row) {
        return false;
      }

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

      await apiRef.current.updateRows([{ id, ...oldRow }]);
      setTimeout(() => {
        apiRef.current.setCellFocus(id, Object.keys(oldRow)[0]);
      }, 0);
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: 0,
      });
    },

    redo: async (data: GridRowEditHistoryData) => {
      const { id, newRow } = data;

      await apiRef.current.updateRows([{ id, ...newRow }]);
      setTimeout(() => {
        apiRef.current.setCellFocus(id, Object.keys(newRow)[0]);
      }, 0);
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: 0,
      });
    },
  };
};

/**
 * Create the default handler for clipboardPasteEnd events.
 */
export const createClipboardPasteHistoryHandler = (
  apiRef: RefObject<GridPrivateApiPremium>,
): GridHistoryEventHandler<GridClipboardPasteHistoryData> => {
  return {
    store: (params: GridClipboardPasteHistoryData) => params,
    validate: (data: GridClipboardPasteHistoryData, direction: 'undo' | 'redo') => {
      const { oldRows, newRows } = data;
      const updatedRowIds = Object.keys(newRows);

      // Check if any rows were updated
      if (updatedRowIds.length === 0) {
        return false;
      }

      // Check if all affected rows still exist and have expected values
      for (let i = 0; i < updatedRowIds.length; i += 1) {
        const rowId = updatedRowIds[i];
        const row = apiRef.current.getRow(rowId);
        if (!row) {
          return false;
        }

        const expectedRow = direction === 'undo' ? newRows[rowId] : oldRows[rowId];

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
      const { oldRows } = data;
      const oldRowsValues = Object.values(oldRows);

      // Restore all rows to their original state
      await apiRef.current.updateRows(oldRowsValues);

      const visibleColumns = apiRef.current.getVisibleColumns();

      // Focus the first affected cell
      if (oldRowsValues.length > 0 && visibleColumns.length > 0) {
        const firstRowId = Object.keys(oldRows)[0];
        const firstField = visibleColumns[0].field;
        if (firstField) {
          setTimeout(() => {
            apiRef.current.setCellFocus(firstRowId, firstField);
          }, 0);
          apiRef.current.scrollToIndexes({
            rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(firstRowId),
            colIndex: apiRef.current.getColumnIndex(firstField),
          });
        }
      }
    },

    redo: async (data: GridClipboardPasteHistoryData) => {
      const { newRows } = data;
      const newRowsValues = Object.values(newRows);

      // Restore all rows to the pasted state
      await apiRef.current.updateRows(newRowsValues);

      const visibleColumns = apiRef.current.getVisibleColumns();

      // Focus the first affected cell
      if (newRowsValues.length > 0 && visibleColumns.length > 0) {
        const firstRowId = Object.keys(newRows)[0];
        const firstField = visibleColumns[0].field;
        if (firstField) {
          setTimeout(() => {
            apiRef.current.setCellFocus(firstRowId, firstField);
          }, 0);
          apiRef.current.scrollToIndexes({
            rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(firstRowId),
            colIndex: apiRef.current.getColumnIndex(firstField),
          });
        }
      }
    },
  };
};

/**
 * Create the default history events map.
 */
export const createDefaultHistoryHandlers = (apiRef: RefObject<GridPrivateApiPremium>) =>
  ({
    cellEditStop: createCellEditHistoryHandler(apiRef),
    rowEditStop: createRowEditHistoryHandler(apiRef),
    clipboardPasteEnd: createClipboardPasteHistoryHandler(apiRef),
  }) as Record<
    GridEvents,
    GridHistoryEventHandler<
      GridCellEditHistoryData | GridRowEditHistoryData | GridClipboardPasteHistoryData
    >
  >;
