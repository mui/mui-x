import * as React from 'react';
import { useMovieData } from '@mui/x-data-grid-generator';
import { DataGridPro } from '@mui/x-data-grid-pro';

export default function AggregationInitialState() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{
          aggregation: {
            model: { gross: { method: 'sum' } },
          },
        }}
      />
    </div>
  );
}
