import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';

// eliminate rounding errors in aggregation row
const valueFormatter = (value) => `${Math.floor(value * 1000) / 1000} °C`;

const columns = [
  { field: 'city' },
  {
    field: 'oct',
    type: 'number',
    valueFormatter,
  },
  {
    field: 'nov',
    type: 'number',
    valueFormatter,
  },
  {
    field: 'dec',
    type: 'number',
    valueFormatter,
  },
];

const rows = [
  { id: 1, city: 'Amsterdam', oct: 7.1, nov: 4, dec: 10.2 },
  { id: 2, city: 'Barcelona', oct: 14.9, nov: 12.3, dec: 18.2 },
  { id: 3, city: 'Paris', oct: 8.1, nov: 5.4, dec: 12.3 },
  { id: 4, city: 'São Paulo', oct: 20.2, nov: 21.1, dec: 19.2 },
];

export default function StylingAllCellsButAggregation() {
  return (
    <Box
      sx={{
        height: 300,
        width: '100%',
        [`.${gridClasses.cell}.cold`]: {
          backgroundColor: '#b9d5ff91',
          color: '#1a3e72',
        },
        [`.${gridClasses.cell}.hot`]: {
          backgroundColor: '#ff943975',
          color: '#1a3e72',
        },
      }}
    >
      <DataGridPremium
        rows={rows}
        columns={columns}
        getCellClassName={(params) => {
          if (
            params.field === 'city' ||
            params.value == null ||
            params.id.toString().startsWith('auto-generated')
          ) {
            return '';
          }
          return params.value >= 15 ? 'hot' : 'cold';
        }}
        initialState={{
          aggregation: {
            model: {
              oct: 'avg',
              nov: 'avg',
              dec: 'avg',
            },
          },
        }}
      />
    </Box>
  );
}
