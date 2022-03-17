import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';

const rows = [
  { id: 1, item: 'Paperclip', quantity: 100, price: 1.99 },
  { id: 2, item: 'Paper', quantity: 10, price: 30 },
  { id: 3, item: 'Pencil', quantity: 100, price: 1.25 },
  { id: 'SUBTOTAL', label: 'Subtotal', subtotal: 624 },
  { id: 'TAX', label: 'Tax', taxRate: 10, taxTotal: 62.4 },
  { id: 'TOTAL', label: 'Total', total: 686.4 },
];

const columns = [
  {
    field: 'item',
    headerName: 'Item/Description',
    flex: 3,
    sortable: false,
    colSpan: ({ row }) => {
      if (row.id === 'SUBTOTAL' || row.id === 'TOTAL') {
        return 3;
      }
      if (row.id === 'TAX') {
        return 2;
      }
      return undefined;
    },
    valueGetter: ({ value, row }) => {
      if (row.id === 'SUBTOTAL' || row.id === 'TAX' || row.id === 'TOTAL') {
        return row.label;
      }
      return value;
    },
  },
  { field: 'quantity', headerName: 'Quantity', flex: 1, sortable: false },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1,
    sortable: false,
    valueGetter: ({ row, value }) => {
      if (row.id === 'TAX') {
        return `${row.taxRate}%`;
      }
      return value;
    },
  },
  {
    field: 'total',
    headerName: 'Total',
    flex: 1,
    sortable: false,
    valueGetter: ({ row }) => {
      if (row.id === 'SUBTOTAL') {
        return row.subtotal;
      }
      if (row.id === 'TAX') {
        return row.taxTotal;
      }
      if (row.id === 'TOTAL') {
        return row.total;
      }
      return row.price * row.quantity;
    },
  },
];

function getCellClassName({ row, field }) {
  if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
    if (field === 'item') {
      return 'bold';
    }
  }
  return '';
}

export default function ColumnSpanningFunction() {
  return (
    <Box
      sx={{
        width: '100%',
        '& .bold': {
          fontWeight: 600,
        },
      }}
    >
      <DataGridPro
        autoHeight
        disableExtendRowFullWidth
        disableColumnFilter
        disableSelectionOnClick
        hideFooter
        showCellRightBorder
        showColumnRightBorder
        getCellClassName={getCellClassName}
        columns={columns}
        rows={rows}
      />
    </Box>
  );
}
