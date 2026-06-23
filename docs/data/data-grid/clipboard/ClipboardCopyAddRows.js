import * as React from 'react';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { randomEmail, randomId, randomUserName } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

const columns = [
  { field: 'name', headerName: 'Name', width: 200, editable: true },
  { field: 'email', headerName: 'Email', width: 250, editable: true },
];

const initialRows = [
  { id: randomId(), name: randomUserName(), email: randomEmail() },
  { id: randomId(), name: randomUserName(), email: randomEmail() },
  { id: randomId(), name: randomUserName(), email: randomEmail() },
];

const parseTextToRows = (text) =>
  text
    .split('\n')
    .filter((row) => row.length > 0)
    .map((row) => {
      const [name, email] = row.split('\t');
      return { id: randomId(), name, email };
    });

export default function ClipboardCopyAddRows() {
  const apiRef = useGridApiRef();
  const [copiedRows, setCopiedRows] = React.useState([]);

  const handleClipboardCopy = (text) => {
    setCopiedRows(parseTextToRows(text));
  };

  const handleAddRowsFromClipboard = () => {
    apiRef.current?.updateRows(
      copiedRows.map((row) => ({ ...row, id: randomId() })),
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Button
        onClick={handleAddRowsFromClipboard}
        disabled={copiedRows.length === 0}
        sx={{ mb: 1 }}
      >
        {copiedRows.length > 0
          ? `Add ${copiedRows.length} row(s) from clipboard`
          : 'Copy some rows to enable'}
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPremium
          apiRef={apiRef}
          rows={initialRows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          onClipboardCopy={handleClipboardCopy}
          ignoreValueFormatterDuringExport
        />
      </div>
    </div>
  );
}
