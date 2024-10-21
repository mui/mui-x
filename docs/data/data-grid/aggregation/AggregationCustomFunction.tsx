import * as React from 'react';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
  GridAggregationFunction,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
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
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

const firstAlphabeticalAggregation: GridAggregationFunction<string, string | null> =
  {
    apply: (params) => {
      if (params.values.length === 0) {
        return null;
      }

      const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

      return sortedValue[0];
    },
    label: 'first alphabetical',
    columnTypes: ['string'],
  };

const lastAlphabeticalAggregation: GridAggregationFunction<string, string | null> = {
  apply: (params) => {
    if (params.values.length === 0) {
      return null;
    }

    const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

    return sortedValue[sortedValue.length - 1];
  },
  label: 'last alphabetical',
  columnTypes: ['string'],
};

export default function AggregationCustomFunction() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
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
      />
    </div>
  );
}
