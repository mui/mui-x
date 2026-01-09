import { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  type GridCellEditStopParams,
  type GridRowEditStopParams,
  type GridEvents,
  gridVisibleRowsSelector,
  gridVisibleColumnFieldsSelector,
  gridColumnFieldsSelector,
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
 * Create the default handler for cellEditStop events.
 */
export const createCellEditHistoryHandler = (
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<GridCellEditHistoryData> => {
  return {
    store: (params: GridCellEditStopParams) => {
      const { id, field } = params;

      const oldValue = apiRef.current.getRow(id)[field];
      const newValue = apiRef.current.getRowWithUpdatedValues(id, field)[field];

      if (isDeepEqual(oldValue, newValue)) {
        return null;
      }

      return {
        id,
        field,
        oldValue,
        newValue,
      };
    },

    validate: (data: GridCellEditHistoryData, direction: 'undo' | 'redo') => {
      const { id, field, oldValue, newValue } = data;

      // Check if column is visible
      if (!gridVisibleColumnFieldsSelector(apiRef).includes(field)) {
        return false;
      }

      const { rowIdToIndexMap, range } = gridVisibleRowsSelector(apiRef);

      // Check if row is in the current page
      const rowIndex = rowIdToIndexMap.get(id);
      if (
        rowIndex === undefined ||
        rowIndex < (range?.firstRowIndex || 0) ||
        rowIndex > (range?.lastRowIndex || rowIndex)
      ) {
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

      if (apiRef.current.state.props.dataSource?.updateRow) {
        const row = apiRef.current.getRow(id);
        await apiRef.current.dataSource.editRow({
          rowId: id,
          updatedRow: { ...row, [field]: oldValue },
          previousRow: row,
        });
      } else {
        await apiRef.current.updateRows([{ id, [field]: oldValue }]);
      }

      // Use `requestAnimationFrame` to ensure all undo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, field);
      });
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: apiRef.current.getColumnIndex(field),
      });
    },

    redo: async (data: GridCellEditHistoryData) => {
      const { id, field, newValue } = data;

      if (apiRef.current.state.props.dataSource?.updateRow) {
        const row = apiRef.current.getRow(id);
        await apiRef.current.dataSource.editRow({
          rowId: id,
          updatedRow: { ...row, [field]: newValue },
          previousRow: row,
        });
      } else {
        await apiRef.current.updateRows([{ id, [field]: newValue }]);
      }

      // Use `requestAnimationFrame` to ensure all redo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, field);
      });
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

      const { rowIdToIndexMap, range } = gridVisibleRowsSelector(apiRef);

      // Check if row is in the current page
      const rowIndex = rowIdToIndexMap.get(id);
      if (
        rowIndex === undefined ||
        rowIndex < (range?.firstRowIndex || 0) ||
        rowIndex > (range?.lastRowIndex || rowIndex)
      ) {
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
      const { id, oldRow, newRow } = data;

      if (apiRef.current.state.props.dataSource?.updateRow) {
        await apiRef.current.dataSource.editRow({
          rowId: id,
          updatedRow: oldRow,
          previousRow: newRow,
        });
      } else {
        await apiRef.current.updateRows([{ id, ...oldRow }]);
      }

      // Use `requestAnimationFrame` to ensure all undo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, Object.keys(oldRow)[0]);
      });
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: 0,
      });
    },

    redo: async (data: GridRowEditHistoryData) => {
      const { id, oldRow, newRow } = data;

      if (apiRef.current.state.props.dataSource?.updateRow) {
        await apiRef.current.dataSource.editRow({
          rowId: id,
          updatedRow: newRow,
          previousRow: oldRow,
        });
      } else {
        await apiRef.current.updateRows([{ id, ...newRow }]);
      }

      // Use `requestAnimationFrame` to ensure all redo updates are applied
      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, Object.keys(newRow)[0]);
      });
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
      const { rowIdToIndexMap, range } = gridVisibleRowsSelector(apiRef);

      for (let i = 0; i < updatedRowIds.length; i += 1) {
        const rowId = updatedRowIds[i];
        const rowIndex = rowIdToIndexMap.get(rowId);
        if (
          rowIndex === undefined ||
          rowIndex < (range?.firstRowIndex || 0) ||
          rowIndex > (range?.lastRowIndex || rowIndex)
        ) {
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
        await apiRef.current.updateRows(oldRowsValues);

        if (differentFieldIndex >= 0) {
          requestAnimationFrame(() => {
            apiRef.current.setCellFocus(firstNewRowId, columnOrder[differentFieldIndex]);
          });
          apiRef.current.scrollToIndexes({
            rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(firstNewRowId),
            colIndex: differentFieldIndex,
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
        await apiRef.current.updateRows(newRowsValues);

        if (differentFieldIndex >= 0) {
          requestAnimationFrame(() => {
            apiRef.current.setCellFocus(firstNewRowId, columnOrder[differentFieldIndex]);
          });

          apiRef.current.scrollToIndexes({
            rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(firstNewRowId),
            colIndex: differentFieldIndex,
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
