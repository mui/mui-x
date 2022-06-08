import * as React from 'react';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const COLUMNS = [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    groupable: false,
    aggregable: false,
  },
  {
    field: 'director',
    headerName: 'Director',
    width: 200,
  },
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

const firstAlphabeticalAggregation = {
  apply: (params) => {
    if (params.values.length === 0) {
      return null;
    }

    const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

    return sortedValue[0];
  },
  label: 'firstAlphabetical',
  columnTypes: ['string'],
};

const lastAlphabeticalAggregation = {
  apply: (params) => {
    if (params.values.length === 0) {
      return null;
    }

    const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

    return sortedValue[sortedValue.length - 1];
  },
  label: 'alphabeticalLast',
  columnTypes: ['string'],
};

export default function AggregationCustomFunction() {
  const data = useMovieData();

  return (
    <DataGridPremium
      // The 2 following props are here to avoid scroll in the demo while we don't have pinned rows
      rows={data.rows.slice(0, 3)}
      autoHeight
      columns={COLUMNS}
      aggregationFunctions={{
        ...GRID_AGGREGATION_FUNCTIONS,
        firstAlphabetical: firstAlphabeticalAggregation,
        lastAlphabetical: lastAlphabeticalAggregation,
      }}
      initialState={{
        aggregation: {
          model: {
            director: 'firstAlphabetical',
          },
        },
      }}
      experimentalFeatures={{
        aggregation: true,
      }}
    />
  );
}
