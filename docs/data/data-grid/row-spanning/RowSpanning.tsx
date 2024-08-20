import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Box>
  );
}

const columns: GridColDef<(typeof rows)[number]>[] = [
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
  {
    field: 'decision',
    headerName: 'Decision',
    type: 'number',
    width: 100,
  },
  {
    field: 'location',
    headerName: 'Location',
    type: 'number',
    width: 100,
    rowSpanValueGetter: () => {
      // Exclude this column from row spanning irrespective of the values
      return undefined;
    },
  },
];

const rows = [
  {
    id: 1,
    event: 'Event 1',
    indicator: 'Indicator 1',
    action: 'Actions 1',
    decision: 1,
    location: 2,
  },
  {
    id: 2,
    event: 'Event 1',
    indicator: 'Indicator 1',
    action: 'Actions 2',
    decision: 1,
    location: 3,
  },
  {
    id: 3,
    event: 'Event 1',
    indicator: 'Indicator 1',
    action: 'Actions 3',
    decision: 1,
    location: 1,
  },
  {
    id: 4,
    event: 'Event 1',
    indicator: 'Indicator 2',
    action: 'Actions 1',
    decision: 4,
    location: 3,
  },
  {
    id: 5,
    event: 'Event 1',
    indicator: 'Indicator 2',
    action: 'Actions 2',
    decision: 4,
    location: 3,
  },
  {
    id: 6,
    event: 'Event 2',
    indicator: 'Indicator 1',
    action: 'Actions 1',
    decision: 6,
    location: 1,
  },
  {
    id: 7,
    event: 'Event 2',
    indicator: 'Indicator 1',
    action: 'Actions 2',
    decision: 6,
    location: 2,
  },
  {
    id: 8,
    event: 'Event 2',
    indicator: 'Indicator 1',
    action: 'Actions 3',
    decision: 6,
    location: 2,
  },
  {
    id: 9,
    event: 'Event 2',
    indicator: 'Indicator 2',
    action: 'Actions 1',
    decision: 9,
    location: 1,
  },
  {
    id: 10,
    event: 'Event 2',
    indicator: 'Indicator 2',
    action: 'Actions 2',
    decision: 9,
    location: 4,
  },
  {
    id: 11,
    event: 'Event 3',
    indicator: 'Indicator 1',
    action: 'Actions 1',
    decision: 11,
    location: 1,
  },
  {
    id: 12,
    event: 'Event 3',
    indicator: 'Indicator 1',
    action: 'Actions 2',
    decision: 11,
    location: 1,
  },
  {
    id: 13,
    event: 'Event 3',
    indicator: 'Indicator 1',
    action: 'Actions 3',
    decision: 11,
    location: 2,
  },
  {
    id: 14,
    event: 'Event 3',
    indicator: 'Indicator 2',
    action: 'Actions 1',
    decision: 14,
    location: 4,
  },
  {
    id: 15,
    event: 'Event 3',
    indicator: 'Indicator 2',
    action: 'Actions 2',
    decision: 14,
    location: 3,
  },
];
