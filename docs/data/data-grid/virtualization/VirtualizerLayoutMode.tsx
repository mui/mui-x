import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', flex: 1 },
  { field: 'lastName', headerName: 'Last name', flex: 1 },
  { field: 'age', headerName: 'Age', type: 'number' as const, width: 80 },
  { field: 'email', headerName: 'Email', flex: 2 },
];

const rows = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  firstName: `First ${i + 1}`,
  lastName: `Last ${i + 1}`,
  age: 20 + (i % 50),
  email: `user${i + 1}@example.com`,
}));

type LayoutMode = 'uncontrolled' | 'controlled';

export default function VirtualizerLayoutMode() {
  const [layoutMode, setLayoutMode] = React.useState<LayoutMode>('uncontrolled');

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="body2">Layout mode:</Typography>
        <ToggleButtonGroup
          size="small"
          value={layoutMode}
          exclusive
          onChange={(_, value: LayoutMode) => {
            if (value !== null) {
              setLayoutMode(value);
            }
          }}
        >
          <ToggleButton value="uncontrolled">Uncontrolled</ToggleButton>
          <ToggleButton value="controlled">Controlled</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <div style={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          experimentalFeatures={{ virtualizerLayoutMode: layoutMode }}
        />
      </div>
    </Stack>
  );
}
