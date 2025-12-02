import { RefObject } from '@mui/x-internals/types';
import type {
  GridCellEditStopParams,
  GridRowEditStopParams,
  GridCellEditStartParams,
  GridRowEditStartParams,
  GridRowId,
  GridEvents,
} from '@mui/x-data-grid-pro';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  GridHistoryEventHandler,
  GridCellEditHistoryData,
  GridRowEditHistoryData,
} from './gridHistoryInterfaces';

/**
 * Create the default handler for cellEditStop events.
 * It needs to subscribe to cellEditStart to capture the old values.
 */
export const createCellEditHistoryHandler = (
  apiRef: RefObject<GridPrivateApiPremium>,
): GridHistoryEventHandler<GridCellEditHistoryData> => {
  // Store to track values before editing
  const cellEditStartValues = new Map<string, any>();
  const getCellKey = (id: GridRowId, field: string): string => {
    return `${id}-${field}`;
  };

  apiRef.current.subscribeEvent('cellEditStart', (params: GridCellEditStartParams) => {
    const { id, field } = params;
    const row = apiRef.current.getRow(id);
    if (row) {
      const key = getCellKey(id, field);
      cellEditStartValues.set(key, row[field]);
    }
  });

  return {
    store: (params: GridCellEditStopParams) => {
      const { id, field } = params;
      const key = getCellKey(id, field);
      const oldValue = cellEditStartValues.get(key);

      // Clean up the stored value
      cellEditStartValues.delete(key);

      const row = apiRef.current.getRow(id);
      const newValue = row ? row[field] : undefined;

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

      // Check if row is in the current page (visible)
      const rowNode = apiRef.current.getRowNode(id);
      if (!rowNode) {
        return false;
      }

      // Check if the value hasn't changed externally
      const currentValue = row[field];
      const expectedValue = direction === 'undo' ? newValue : oldValue;

      if (currentValue !== expectedValue) {
        return false;
      }

      return true;
    },

    undo: async (data: GridCellEditHistoryData) => {
      const { id, field, oldValue } = data;

      await apiRef.current.updateRows([{ id, [field]: oldValue }]);
      apiRef.current.setCellFocus(id, field);
    },

    redo: async (data: GridCellEditHistoryData) => {
      const { id, field, newValue } = data;

      await apiRef.current.updateRows([{ id, [field]: newValue }]);
      apiRef.current.setCellFocus(id, field);
    },
  };
};

/**
 * Create the default handler for rowEditStop events.
 * Note: This also needs to subscribe to rowEditStart to capture old values.
 */
export const createRowEditHistoryHandler = (
  apiRef: RefObject<GridPrivateApiPremium>,
): GridHistoryEventHandler<GridRowEditHistoryData> => {
  const rowEditStartValues = new Map<GridRowId, Record<string, any>>();

  apiRef.current.subscribeEvent('rowEditStart', (params: GridRowEditStartParams) => {
    const { id } = params;
    const row = apiRef.current.getRow(id);
    if (row) {
      rowEditStartValues.set(id, { ...row });
    }
  });

  return {
    store: (params: GridRowEditStopParams) => {
      const { id } = params;
      const oldRow = rowEditStartValues.get(id) || {};

      // Clean up the stored value
      rowEditStartValues.delete(id);

      const row = apiRef.current.getRow(id);
      const newRow = row ? { ...row } : {};

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

      // Check if row is in the current page (visible)
      const rowNode = apiRef.current.getRowNode(id);
      if (!rowNode) {
        return false;
      }

      // Check if modified fields haven't changed externally
      const expectedRow = direction === 'undo' ? newRow : oldRow;

      for (const field of Object.keys(expectedRow)) {
        if (row[field] !== expectedRow[field]) {
          return false;
        }
      }

      return true;
    },

    undo: async (data: GridRowEditHistoryData) => {
      const { id, oldRow } = data;

      await apiRef.current.updateRows([{ id, ...oldRow }]);
      apiRef.current.setCellFocus(id, Object.keys(oldRow)[0]);
    },

    redo: async (data: GridRowEditHistoryData) => {
      const { id, newRow } = data;

      await apiRef.current.updateRows([{ id, ...newRow }]);
      apiRef.current.setCellFocus(id, Object.keys(newRow)[0]);
    },
  };
};

/**
 * Create the default history events map.
 */
export const createDefaultHistoryHandlers = (
  apiRef: RefObject<GridPrivateApiPremium>,
): Map<GridEvents, GridHistoryEventHandler<GridCellEditHistoryData | GridRowEditHistoryData>> => {
  const map = new Map();

  map.set('cellEditStop', createCellEditHistoryHandler(apiRef));
  map.set('rowEditStop', createRowEditHistoryHandler(apiRef));

  return map;
};
