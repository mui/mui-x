import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GridAggregationLookup, GridColDef } from '@mui/x-data-grid-premium';
import { DataGridPremium, GRID_ROOT_GROUP_ID } from '@mui/x-data-grid-premium';
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

export default function AggregationLookupChange() {
  const data = useMovieData();
  const [totalGross, setTotalGross] = React.useState<number | null>(null);

  const handleAggregationLookupChange = React.useCallback(
    (lookup: GridAggregationLookup) => {
      setTotalGross(lookup[GRID_ROOT_GROUP_ID]?.gross?.value ?? null);
    },
    [],
  );

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Typography variant="body2">
        Total gross of the filtered movies:{' '}
        <strong>
          {totalGross === null ? '-' : currencyFormatter.format(totalGross)}
        </strong>
      </Typography>
      <div style={{ height: 400 }}>
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
          onAggregationLookupChange={handleAggregationLookupChange}
          showToolbar
        />
      </div>
    </Stack>
  );
}
