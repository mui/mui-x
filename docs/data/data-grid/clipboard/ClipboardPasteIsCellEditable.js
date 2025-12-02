import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const rows = [
  {
    id: 1,
    product: 'Laptop',
    quantity: 10,
    price: 999.99,
    status: 'active',
    lastModified: '2024-01-15',
  },
  {
    id: 2,
    product: 'Mouse',
    quantity: 50,
    price: 29.99,
    status: 'active',
    lastModified: '2024-01-16',
  },
  {
    id: 3,
    product: 'Keyboard',
    quantity: 30,
    price: 79.99,
    status: 'archived',
    lastModified: '2024-01-10',
  },
  {
    id: 4,
    product: 'Monitor',
    quantity: 15,
    price: 299.99,
    status: 'active',
    lastModified: '2024-01-17',
  },
  {
    id: 5,
    product: 'Headphones',
    quantity: 25,
    price: 149.99,
    status: 'archived',
    lastModified: '2024-01-05',
  },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'product', headerName: 'Product', width: 150, editable: true },
  { field: 'quantity', headerName: 'Quantity', width: 120, editable: true },
  { field: 'price', headerName: 'Price', width: 120, editable: true },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    editable: false,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === 'active' ? 'success' : 'default'}
        size="small"
      />
    ),
  },
  {
    field: 'lastModified',
    headerName: 'Last Modified',
    width: 150,
    editable: false,
  },
];

const isCellEditable = (params) => {
  // Price cannot be edited for archived products
  if (params.field === 'price' && params.row.status === 'archived') {
    return false;
  }
  return true;
};

export default function ClipboardPasteIsCellEditable() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        cellSelection
        disableRowSelectionOnClick
        ignoreValueFormatterDuringExport
        isCellEditable={isCellEditable}
      />
    </Box>
  );
}
