import * as React from 'react';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const COLUMNS = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: ({ value }) => {
      if (!value || typeof value !== 'number') {
        return value;
      }
      return `${value.toLocaleString()}$`;
    },
  },
];

export default function AggregationRemoveFunctionAllColumns() {
  const data = useMovieData();

  return (
    <div style={{ height: 318, width: '100%' }}>
      <DataGridPremium
        // The following prop is here to avoid scroll in the demo while we don't have pinned rows
        rows={data.rows.slice(0, 3)}
        columns={COLUMNS}
        aggregationFunctions={Object.fromEntries(
          Object.entries(GRID_AGGREGATION_FUNCTIONS).filter(
            ([name]) => name !== 'sum',
          ),
        )}
        initialState={{
          aggregation: {
            model: {
              gross: {
                footer: 'max',
              },
            },
          },
        }}
      />
    </div>
  );
}
