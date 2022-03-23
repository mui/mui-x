import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
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

export default function AggregationRowGroupingInline() {
  const data = useMovieData();

  return (
    <div style={{ height: 318, width: '100%' }}>
      <DataGridPro
        {...data}
        columns={COLUMNS}
        disableSelectionOnClick
        aggregationPosition="inline"
        initialState={{
          rowGrouping: {
            model: ['company'],
          },
          aggregation: {
            model: {
              gross: 'sum',
            },
          },
          columns: {
            columnVisibilityModel: {
              company: false,
            },
          },
        }}
        experimentalFeatures={{
          rowGrouping: true,
          aggregation: true,
        }}
      />
    </div>
  );
}
