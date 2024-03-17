import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { randomStatusOptions, randomPrice } from '@mui/x-data-grid-generator';

const rows = [
  {
    id: 1,
    status: randomStatusOptions(),
    subTotal: randomPrice(),
    total: randomPrice(),
  },
  {
    id: 2,
    status: randomStatusOptions(),
    subTotal: randomPrice(),
    total: randomPrice(),
  },
  {
    id: 3,
    status: randomStatusOptions(),
    subTotal: randomPrice(),
    total: randomPrice(),
  },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const usdPrice = {
  type: 'number',
  width: 130,
  valueFormatter: (value) => currencyFormatter.format(value),
  cellClassName: 'font-tabular-nums',
};

export default function CustomColumnTypesGrid() {
  return (
    <Box
      sx={{
        height: 300,
        width: '100%',
        '& .font-tabular-nums': {
          fontVariantNumeric: 'tabular-nums',
        },
      }}
    >
      <DataGrid
        columns={[
          { field: 'status', width: 130 },
          { field: 'subTotal', ...usdPrice },
          { field: 'total', ...usdPrice },
        ]}
        rows={rows}
      />
    </Box>
  );
}
