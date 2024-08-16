import * as React from 'react';
import Box from '@mui/material/Box';
import { GridColDef, DataGrid, GridCellParams, gridClasses } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'city' },
  { field: 'oct', type: 'number', valueFormatter: (value) => `${value} °C` },
  { field: 'nov', type: 'number', valueFormatter: (value) => `${value} °C` },
  { field: 'dec', type: 'number', valueFormatter: (value) => `${value} °C` },
];

const rows = [
  { id: 1, city: 'Amsterdam', oct: 7.1, nov: 4, dec: 10.2 },
  { id: 2, city: 'Barcelona', oct: 14.9, nov: 12.3, dec: 18.2 },
  { id: 3, city: 'Paris', oct: 8.1, nov: 5.4, dec: 12.3 },
  { id: 4, city: 'São Paulo', oct: 20.2, nov: 21.1, dec: 19.2 },
];

export default function StylingAllCells() {
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
      <DataGrid
        rows={rows}
        columns={columns}
        getCellClassName={(params: GridCellParams<any, any, number>) => {
          if (params.field === 'city' || params.value == null) {
            return '';
          }
          return params.value >= 15 ? 'hot' : 'cold';
        }}
      />
    </Box>
  );
}
