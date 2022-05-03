import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

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

export default function AggregationRowGroupingFooter() {
  const data = useMovieData();

  return (
    <div style={{ height: 370, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={COLUMNS}
        disableSelectionOnClick
        initialState={{
          rowGrouping: {
            model: ['company'],
          },
          aggregation: {
            model: {
              gross: {
                footer: 'sum',
              },
            },
          },
          columns: {
            columnVisibilityModel: {
              company: false,
            },
          },
        }}
      />
    </div>
  );
}
