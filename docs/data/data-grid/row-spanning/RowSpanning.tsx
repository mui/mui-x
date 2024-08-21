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
    field: 'code',
    headerName: 'Item Code',
    width: 85,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 170,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 80,
    // Do not span the values
    rowSpanValueGetter: () => null,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    type: 'number',
    valueFormatter: (value) => `$${value}.00`,
  },
  {
    field: 'totalPrice',
    headerName: 'Total Price',
    type: 'number',
    valueGetter: (value, row) => value ?? row?.unitPrice,
    valueFormatter: (value) => `$${value}.00`,
  },
];

const rows = [
  {
    id: 1,
    code: 'A101',
    description: 'Wireless Mouse',
    quantity: 2,
    unitPrice: 50,
    totalPrice: 100,
  },
  {
    id: 2,
    code: 'A102',
    description: 'Mechanical Keyboard',
    quantity: 1,
    unitPrice: 75,
  },
  {
    id: 3,
    code: 'A103',
    description: 'USB Dock Station',
    quantity: 1,
    unitPrice: 400,
  },
  {
    id: 4,
    code: 'A104',
    description: 'Laptop',
    quantity: 1,
    unitPrice: 1800,
    totalPrice: 2050,
  },
  {
    id: 5,
    code: 'A104',
    description: '- 16GB RAM Upgrade',
    quantity: 1,
    unitPrice: 100,
    totalPrice: 2050,
  },
  {
    id: 6,
    code: 'A104',
    description: '- 512GB SSD Upgrade',
    quantity: 1,
    unitPrice: 150,
    totalPrice: 2050,
  },
];
