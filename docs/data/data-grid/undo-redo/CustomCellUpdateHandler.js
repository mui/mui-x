import * as React from 'react';

import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import Box from '@mui/material/Box';
import {
  DataGridPremium,
  useGridApiRef,
  createClipboardPasteHistoryHandler,
  gridExpandedSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  gridPaginationModelSelector,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

function createCustomCellEditHandler(apiRef) {
  return {
    store: (params) => {
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
    undo: async (data) => {
      const { id, field, oldValue } = data;

      // We are not using the data source, do we don't have to do the checks like in the default handler.
      await apiRef.current.updateRows([{ id, [field]: oldValue }]);

      // Navigate to the page with the row if it's on a different page
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      const paginationModel = gridPaginationModelSelector(apiRef);

      console.log('rowIndex', rowIndex, paginationModel);

      if (paginationModel && rowIndex !== undefined) {
        const page = Math.floor(rowIndex / paginationModel.pageSize);
        if (page !== paginationModel.page) {
          apiRef.current.setPage(page);
        }
      }

      setTimeout(() => {
        apiRef.current.setCellFocus(id, field);
      }, 0);
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: apiRef.current.getColumnIndex(field),
      });
    },
    redo: async (data) => {
      const { id, field, newValue } = data;

      // Repeat the same logic as in the undo method
      await apiRef.current.updateRows([{ id, [field]: newValue }]);

      // Navigate to the row if it's on a different page
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      const paginationModel = gridPaginationModelSelector(apiRef);

      if (paginationModel && rowIndex !== undefined) {
        const page = Math.floor(rowIndex / paginationModel.pageSize);
        if (page !== paginationModel.page) {
          apiRef.current.setPage(page);
        }
      }

      setTimeout(() => {
        apiRef.current.setCellFocus(id, field);
      }, 0);
      apiRef.current.scrollToIndexes({
        rowIndex: apiRef.current.getRowIndexRelativeToVisibleRows(id),
        colIndex: apiRef.current.getColumnIndex(field),
      });
    },
  };
}

export default function CustomCellUpdateHandler() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    editable: true,
  });

  const apiRef = useGridApiRef();

  const historyEventHandlers = React.useMemo(() => {
    if (!apiRef.current) {
      return {};
    }

    return {
      cellEditStop: createCustomCellEditHandler(apiRef),
      clipboardPasteEnd: createClipboardPasteHistoryHandler(apiRef),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef.current]);

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        pagination
        pageSizeOptions={[50, 100]}
        showToolbar
        disableRowSelectionOnClick
        cellSelection
        disablePivoting
        disableRowGrouping
        disableColumnPinning
        historyEventHandlers={historyEventHandlers}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 50 } },
        }}
      />
    </Box>
  );
}
