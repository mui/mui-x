import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const COLUMNS = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'director',
    headerName: 'Director',
    width: 200,
  },
];

const firstAlphabeticalAggregation = {
  apply: (params) => {
    if (params.values.length === 0) {
      return null;
    }

    const sortedValue = params.values.sort((a, b) => a.localeCompare(b));

    return sortedValue[0];
  },
  types: ['string'],
};

const lastAlphabeticalAggregation = {
  apply: (params) => {
    if (params.values.length === 0) {
      return null;
    }

    const sortedValue = params.values.sort((a, b) => a.localeCompare(b));

    return sortedValue[sortedValue.length - 1];
  },
  types: ['string'],
};

export default function AggregationCustomFunction() {
  const data = useMovieData();

  return (
    <div style={{ height: 318, width: '100%' }}>
      <DataGridPro
        // The following prop is here to avoid scroll in the demo while we don't have pinned rows
        rows={data.rows.slice(0, 3)}
        columns={COLUMNS}
        aggregationFunctions={{
          firstAlphabetical: firstAlphabeticalAggregation,
          lastAlphabetical: lastAlphabeticalAggregation,
        }}
        initialState={{
          aggregation: {
            model: {
              director: { functionName: 'firstAlphabetical' },
            },
          },
        }}
        experimentalFeatures={{
          aggregation: true,
        }}
      />
    </div>
  );
}
