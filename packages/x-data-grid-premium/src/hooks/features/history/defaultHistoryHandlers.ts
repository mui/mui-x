import { RefObject } from '@mui/x-internals/types';
import type {
  GridCellEditStopParams,
  GridRowEditStopParams,
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
