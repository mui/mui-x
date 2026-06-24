import * as React from 'react';
import {
  DataGridPremium,
  gridFocusCellSelector,
  gridSortedRowIdsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Mirrors the priority used for the Ctrl+C shortcut: selected cells, then
// selected rows, then the focused cell. It's built entirely from public APIs,
// so it can be triggered from anywhere, including a button or a touch device.
function getSelectionAsText(apiRef) {
  const api = apiRef.current;
  if (!api) {
    return '';
  }

  const selectedCells = api.getSelectedCellsAsArray();
  if (selectedCells.length > 1) {
    const cellSelectionModel = api.getCellSelectionModel();
    const sortedRowIds = gridSortedRowIdsSelector({ current: api }).filter(
      (id) => cellSelectionModel[id],
    );
    return sortedRowIds
      .map((rowId) =>
        Object.keys(cellSelectionModel[rowId])
          .filter((field) => cellSelectionModel[rowId][field])
          .map((field) => String(api.getCellParams(rowId, field).formattedValue))
          .join('\t'),
      )
      .join('\n');
  }

  const selectedRowIds = api.getSelectedRows();
  if (selectedRowIds.size > 0) {
    return api.getDataAsCsv({
      includeHeaders: false,
      shouldAppendQuotes: false,
      escapeFormulas: false,
    });
  }

  const focusedCell = gridFocusCellSelector({ current: api });
  if (focusedCell) {
    return String(
      api.getCellParams(focusedCell.id, focusedCell.field).formattedValue,
    );
  }

  return '';
}

export default function ClipboardCopyButton() {
  const apiRef = useGridApiRef();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Button
        sx={{ alignSelf: 'flex-start' }}
        variant="outlined"
        onClick={() => navigator.clipboard.writeText(getSelectionAsText(apiRef))}
      >
        Copy selection
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPremium apiRef={apiRef} checkboxSelection cellSelection {...data} />
      </div>
    </Stack>
  );
}
