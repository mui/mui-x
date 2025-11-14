import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';

interface Row {
  id: number;
  product: string;
  quantity: number;
  price: number;
  status: 'active' | 'archived';
  lastModified: string;
}

const rows: Row[] = [
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

export default function ClipboardPasteIsCellEditable() {
  const columns: GridColDef<Row>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'product', headerName: 'Product', width: 150, editable: true },
    { field: 'quantity', headerName: 'Quantity', width: 120, editable: true },
    { field: 'price', headerName: 'Price', width: 120, editable: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      editable: true,
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
      editable: true,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Box component="p" sx={{ mb: 1, fontWeight: 'bold' }}>
          Paste restrictions:
        </Box>
        <Box component="ul" sx={{ mt: 0, pl: 2 }}>
          <li>
            <strong>Price column:</strong> Cannot be pasted in archived products
          </li>
          <li>
            <strong>Status column:</strong> Cannot be pasted in any row
          </li>
          <li>
            <strong>Last Modified column:</strong> Cannot be pasted in any row
          </li>
        </Box>
        <Box component="p" sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
          Try selecting multiple cells and pasting data. Cells marked as non-editable
          by <code>isCellEditable</code> will not be updated.
        </Box>
      </Box>
      <Box sx={{ height: 400 }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          cellSelection
          disableRowSelectionOnClick
          ignoreValueFormatterDuringExport
          isCellEditable={(params) => {
            // Price cannot be edited for archived products
            if (params.field === 'price' && params.row.status === 'archived') {
              return false;
            }
            // Status and lastModified are never editable
            if (params.field === 'status' || params.field === 'lastModified') {
              return false;
            }
            return true;
          }}
        />
      </Box>
    </Box>
  );
}

