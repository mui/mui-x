import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

export default function ColumnSizingPersistWidth() {
  const [, forceRender] = React.useState(0);
  const [enabled, setEnabled] = React.useState(true);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormControlLabel
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          control={<Switch />}
          label="Persist Columns Width"
        />
        <Button onClick={() => forceRender((prev) => prev + 1)}>
          Force Rerender
        </Button>
      </div>
      <div style={{ height: 250 }}>
        <DataGrid
          columns={[
            { field: 'id' },
            { field: 'username', width: 125, minWidth: 150, maxWidth: 200 },
            { field: 'age', resizable: false },
          ]}
          rows={rows}
          unstable_persistColumnsWidth={enabled}
        />
      </div>
    </div>
  );
}
