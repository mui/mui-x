import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const items = [
  { id: 1, item: 'Paperclip', quantity: 100, price: 1.99 },
  { id: 2, item: 'Paper', quantity: 10, price: 30 },
  { id: 3, item: 'Pencil', quantity: 100, price: 1.25 },
];

const rows = [
  ...items,
  { id: 'SUBTOTAL', label: 'Subtotal', subtotal: 624 },
  { id: 'TAX', label: 'Tax', taxRate: 10, taxTotal: 62.4 },
  { id: 'TOTAL', label: 'Total', total: 686.4 },
];

const baseColumnOptions = {
  sortable: false,
  pinnable: false,
  hideable: false,
};

const columns = [
  {
    field: 'item',
    headerName: 'Item/Description',
    ...baseColumnOptions,
    flex: 3,
    colSpan: (value, row) => {
      if (row.id === 'SUBTOTAL' || row.id === 'TOTAL') {
        return 3;
      }
      if (row.id === 'TAX') {
        return 2;
      }
      return undefined;
    },
    valueGetter: (value, row) => {
      if (row.id === 'SUBTOTAL' || row.id === 'TAX' || row.id === 'TOTAL') {
        return row.label;
      }
      return value;
    },
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    ...baseColumnOptions,
    flex: 1,
    sortable: false,
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1,
    ...baseColumnOptions,
    valueGetter: (value, row) => {
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
    ...baseColumnOptions,
    valueGetter: (value, row) => {
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

const getCellClassName = ({ row, field }) => {
  if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
    if (field === 'item') {
      return 'bold';
    }
  }
  return '';
};

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
      <DataGrid
        autoHeight
        disableColumnFilter
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        getCellClassName={getCellClassName}
        columns={columns}
        rows={rows}
      />
    </Box>
  );
}
