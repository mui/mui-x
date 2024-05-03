import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationInitialState() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              gross: 'sum',
            },
          },
        }}
      />
    </div>
  );
}
