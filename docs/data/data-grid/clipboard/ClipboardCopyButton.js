import * as React from 'react';
import {
  DataGridPremium,
  gridFocusCellSelector,
  gridSortedRowIdsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
  const [copiedText, setCopiedText] = React.useState('');

  const handleCopy = () => {
    const text = getSelectionAsText(apiRef);
    navigator.clipboard.writeText(text);
    setCopiedText(text);
  };

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Button
        sx={{ alignSelf: 'flex-start' }}
        variant="outlined"
        onClick={handleCopy}
      >
        Copy selection
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPremium apiRef={apiRef} checkboxSelection cellSelection {...data} />
      </div>
      <Typography variant="body2" color="text.secondary">
        Clipboard content:
      </Typography>
      <Paper variant="outlined" sx={{ p: 1.5, minHeight: 48 }}>
        <Typography
          component="pre"
          variant="body2"
          sx={{
            m: 0,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {copiedText || (
            <Typography component="span" color="text.disabled" variant="body2">
              Nothing copied yet
            </Typography>
          )}
        </Typography>
      </Paper>
    </Stack>
  );
}
