import {
  gridExpandedSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  gridPaginationModelSelector,
  gridExpandedSortedRowIndexLookupSelector,
  gridColumnFieldsSelector,
} from '@mui/x-data-grid-premium';
import { isDeepEqual } from './utils';

export function createCustomCellEditHandler(apiRef) {
  return {
    store: (params) => {
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
    validate: (data, direction) => {
      const { id, field, oldValue, newValue } = data;

      // Check if column is visible
      if (!gridVisibleColumnFieldsSelector(apiRef).includes(field)) {
        return false;
      }

      // Allow undo/redo even if the row is on a different page
      // We'll handle navigation in the undo/redo methods
      const expandedFilteredRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      if (!expandedFilteredRowIds.includes(id)) {
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
    undo: (data) => {
      const { id, field, oldValue } = data;

      // We are not using the data source, do we don't have to do the checks like in the default handler.
      apiRef.current.updateRows([{ id, [field]: oldValue }]);

      // Navigate to the page with the row if it's on a different page
      const rowIndex = gridExpandedSortedRowIndexLookupSelector(apiRef)[id];
      const paginationModel = gridPaginationModelSelector(apiRef);

      if (paginationModel && rowIndex !== undefined) {
        const page = Math.floor(rowIndex / paginationModel.pageSize);
        if (page !== paginationModel.page) {
          apiRef.current.setPage(page);
        }
      }

      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, field);
        apiRef.current.scrollToIndexes({
          rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
          colIndex: apiRef.current.getColumnIndex(field),
        });
      });
    },
    redo: (data) => {
      const { id, field, newValue } = data;

      // Repeat the same logic as in the undo method
      apiRef.current.updateRows([{ id, [field]: newValue }]);

      // Navigate to the row if it's on a different page
      const rowIndex = gridExpandedSortedRowIndexLookupSelector(apiRef)[id];
      const paginationModel = gridPaginationModelSelector(apiRef);

      if (paginationModel && rowIndex !== undefined) {
        const page = Math.floor(rowIndex / paginationModel.pageSize);
        if (page !== paginationModel.page) {
          apiRef.current.setPage(page);
        }
      }

      requestAnimationFrame(() => {
        apiRef.current.setCellFocus(id, field);
        apiRef.current.scrollToIndexes({
          rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
          colIndex: apiRef.current.getColumnIndex(field),
        });
      });
    },
  };
}

export function createCustomClipboardPasteHistoryHandler(apiRef) {
  return {
    store: (params) => params,
    validate: (data, direction) => {
      const { oldRows, newRows } = data;
      const updatedRowIds = Array.from(newRows.keys());

      if (updatedRowIds.length === 0) {
        return false;
      }

      const rowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const paginationModel = gridPaginationModelSelector(apiRef);
      const pageSize = paginationModel?.pageSize;

      // all rows should be on the same page
      let expectedPage = null;

      for (let i = 0; i < updatedRowIds.length; i += 1) {
        const rowId = updatedRowIds[i];
        const rowIndex = rowIndexLookup[rowId];

        if (rowIndex === undefined) {
          return false;
        }

        const page = pageSize ? Math.floor(rowIndex / pageSize) : 0;
        if (expectedPage === null) {
          expectedPage = page;
        } else if (expectedPage !== page) {
          return false;
        }

        const row = apiRef.current.getRow(rowId);
        if (!row) {
          return false;
        }

        const expectedRow =
          direction === 'undo' ? newRows.get(rowId) : oldRows.get(rowId);

        for (const field of Object.keys(expectedRow)) {
          if (!isDeepEqual(row[field], expectedRow[field])) {
            return false;
          }
        }
      }

      return true;
    },
    undo: async (data) => {
      const { oldRows, newRows } = data;
      const oldRowsValues = Array.from(oldRows.values());
      const columnOrder = gridColumnFieldsSelector(apiRef);

      if (oldRowsValues.length > 0 && columnOrder.length > 0) {
        const firstOldRow = Array.from(newRows.values())[0];
        const [firstNewRowId, firstNewRow] = Array.from(oldRows.entries())[0];

        let differentFieldIndex = columnOrder.length - 1;
        for (let i = 0; i < columnOrder.length; i += 1) {
          const field = columnOrder[i];
          if (!isDeepEqual(firstOldRow[field], firstNewRow[field])) {
            differentFieldIndex = i;
            break;
          }
        }

        apiRef.current.updateRows(oldRowsValues);

        const rowIndex =
          gridExpandedSortedRowIndexLookupSelector(apiRef)[firstNewRowId];
        const paginationModel = gridPaginationModelSelector(apiRef);
        if (paginationModel && rowIndex !== undefined) {
          const page = Math.floor(rowIndex / paginationModel.pageSize);
          if (page !== paginationModel.page) {
            apiRef.current.setPage(page);
          }
        }

        if (differentFieldIndex >= 0) {
          requestAnimationFrame(() => {
            apiRef.current.setCellFocus(
              firstNewRowId,
              columnOrder[differentFieldIndex],
            );
            apiRef.current.scrollToIndexes({
              rowIndex:
                apiRef.current.getRowIndexRelativeToVisibleRows(firstNewRowId),
              colIndex: differentFieldIndex,
            });
          });
        }
      }
    },
    redo: async (data) => {
      const { oldRows, newRows } = data;
      const newRowsValues = Array.from(newRows.values());
      const columnOrder = gridColumnFieldsSelector(apiRef);

      if (newRowsValues.length > 0 && columnOrder.length > 0) {
        const firstOldRow = Array.from(oldRows.values())[0];
        const [firstNewRowId, firstNewRow] = Array.from(newRows.entries())[0];

        let differentFieldIndex = columnOrder.length - 1;
        for (let i = 0; i < columnOrder.length; i += 1) {
          const field = columnOrder[i];
          if (!isDeepEqual(firstOldRow[field], firstNewRow[field])) {
            differentFieldIndex = i;
            break;
          }
        }

        apiRef.current.updateRows(newRowsValues);

        const rowIndex =
          gridExpandedSortedRowIndexLookupSelector(apiRef)[firstNewRowId];
        const paginationModel = gridPaginationModelSelector(apiRef);
        if (paginationModel && rowIndex !== undefined) {
          const page = Math.floor(rowIndex / paginationModel.pageSize);
          if (page !== paginationModel.page) {
            apiRef.current.setPage(page);
          }
        }

        if (differentFieldIndex >= 0) {
          requestAnimationFrame(() => {
            apiRef.current.setCellFocus(
              firstNewRowId,
              columnOrder[differentFieldIndex],
            );
            apiRef.current.scrollToIndexes({
              rowIndex:
                apiRef.current.getRowIndexRelativeToVisibleRows(firstNewRowId),
              colIndex: differentFieldIndex,
            });
          });
        }
      }
    },
  };
}
