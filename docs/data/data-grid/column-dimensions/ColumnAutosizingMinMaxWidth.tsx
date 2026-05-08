import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

const rows = [
  { id: 1, name: 'Alice', role: 'Engineer', note: 'Short' },
  {
    id: 2,
    name: 'Bob',
    role: 'Product Manager',
    note: 'A much longer note that exceeds typical width',
  },
  { id: 3, name: 'Charlie', role: 'Designer', note: 'Medium length content here' },
  { id: 4, name: 'Diana', role: 'Engineering Manager', note: 'Tiny' },
  {
    id: 5,
    name: 'Eve',
    role: 'QA',
    note: 'Another long note to demonstrate the maximum width cap',
  },
];

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    // autosizeMinWidth only: autosize floors at 180px; manual resize is unrestricted
    autosizeMinWidth: 180,
    description:
      'autosizeMinWidth: 180 — autosize floors at 180px, manual resize unrestricted',
  },
  {
    field: 'role',
    headerName: 'Role',
    // autosizeMaxWidth only: autosize caps at 120px; manual resize is unrestricted
    autosizeMaxWidth: 120,
    description:
      'autosizeMaxWidth: 120 — autosize caps at 120px, manual resize unrestricted',
  },
  {
    field: 'note',
    headerName: 'Note',
    flex: 1,
    // minWidth wins because it is more restrictive than autosizeMinWidth
    minWidth: 200,
    autosizeMinWidth: 80,
    description: 'minWidth: 200, autosizeMinWidth: 80 — minWidth wins (200 > 80)',
  },
];

export default function ColumnAutosizingMinMaxWidth() {
  const apiRef = useGridApiRef();

  return (
    <div style={{ width: '100%' }}>
      <Button
        variant="outlined"
        onClick={() => apiRef.current?.autosizeColumns({ includeHeaders: true })}
        sx={{ mb: 1 }}
      >
        Autosize columns
      </Button>
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid apiRef={apiRef} rows={rows} columns={columns} />
      </div>
    </div>
  );
}
