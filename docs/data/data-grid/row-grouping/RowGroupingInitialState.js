import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingInitialState() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        disableSelectionOnClick
        initialState={{
          rowGrouping: {
            model: ['company', 'director'],
          },
        }}
      />
    </div>
  );
}
