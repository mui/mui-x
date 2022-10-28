import * as React from 'react';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function calculateProfit(gross, budget) {
  return Math.round(((gross - budget) / budget) * 100);
}

const COLUMNS = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'company',
    headerName: 'Company',
    width: 200,
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    minWidth: 140,
    groupable: false,
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'budget',
    headerName: 'Budget',
    type: 'number',
    minWidth: 140,
    groupable: false,
    valueFormatter: ({ value }) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'profit',
    headerName: 'Profit',
    type: 'number',
    flex: 1,
    groupable: false,
    valueGetter: ({ row }) => {
      if (!row.gross || !row.budget) {
        return null;
      }
      return calculateProfit(row.gross, row.budget);
    },
    valueFormatter: ({ value }) => {
      if (!value) {
        return null;
      }
      return `${value}%`;
    },
  },
];

const profit = {
  apply: ({ values }) => {
    const result = values.reduce(
      (acc, value) => {
        if (value) {
          acc.gross += value.gross;
          acc.budget += value.budget;
        }
        return acc;
      },
      { gross: 0, budget: 0 },
    );

    return calculateProfit(result.gross, result.budget);
  },
  getCellValue: ({ row }) => {
    return {
      budget: row.budget,
      gross: row.gross,
    };
  },
  label: 'profit',
  columnTypes: ['number'],
};

export default function AggregationMultiColumn() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
      aggregation: {
        model: {
          gross: 'sum',
          budget: 'sum',
          profit: 'profit',
        },
      },
    },
  });

  return (
    <div style={{ height: 370, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        columns={COLUMNS}
        disableRowSelectionOnClick
        initialState={initialState}
        aggregationFunctions={{
          ...GRID_AGGREGATION_FUNCTIONS,
          profit,
        }}
      />
    </div>
  );
}
