import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'event',
    headerName: 'Event',
    width: 200,
    editable: true,
  },
  {
    field: 'indicator',
    headerName: 'Indicator',
    width: 150,
    editable: true,
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    editable: true,
  },
];

const rows = [
  { id: 1, event: 'Event 1', indicator: 'Indicator 1', action: 'Actions 1' },
  { id: 2, event: 'Event 1', indicator: 'Indicator 1', action: 'Actions 2' },
  { id: 3, event: 'Event 1', indicator: 'Indicator 1', action: 'Actions 3' },
  { id: 4, event: 'Event 1', indicator: 'Indicator 2', action: 'Actions 1' },
  { id: 5, event: 'Event 1', indicator: 'Indicator 2', action: 'Actions 2' },
  { id: 6, event: 'Event 2', indicator: 'Indicator 1', action: 'Actions 1' },
  { id: 7, event: 'Event 2', indicator: 'Indicator 1', action: 'Actions 2' },
  { id: 8, event: 'Event 2', indicator: 'Indicator 1', action: 'Actions 3' },
  { id: 9, event: 'Event 2', indicator: 'Indicator 2', action: 'Actions 1' },
  { id: 10, event: 'Event 2', indicator: 'Indicator 2', action: 'Actions 2' },
];

export default function RowSpanning() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        showCellVerticalBorder
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        unstable_rowSpanning
        disableVirtualization
        sx={{
          '& .MuiDataGrid-row.Mui-hovered': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Box>
  );
}
