import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'hasNotes', headerName: 'Has notes', type: 'boolean' },
];

const rows = [
  { id: 1, customer: 'Matheus', hasNotes: true, notes: 'Requested gift wrapping.' },
  { id: 2, customer: 'Olivier', hasNotes: false, notes: null },
  { id: 3, customer: 'Flavien', hasNotes: true, notes: 'Asked for a refund.' },
  { id: 4, customer: 'Danail', hasNotes: false, notes: null },
];

export default function DetailPanelConditional() {
  // Rows without notes return `null`, which is enough to disable the toggle
  // for that row, so no custom toggle column is needed to hide it manually.
  const getDetailPanelContent = React.useCallback<
    NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }) => (row.notes ? <Box sx={{ p: 2 }}>{row.notes}</Box> : null), []);

  const getDetailPanelHeight = React.useCallback(() => 'auto' as const, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ mb: 1 }} variant="body2">
        Only rows with notes have an enabled toggle.
      </Typography>
      <Box sx={{ height: 300 }}>
        <DataGridPro
          columns={columns}
          rows={rows}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
        />
      </Box>
    </Box>
  );
}
