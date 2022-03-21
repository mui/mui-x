import * as React from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const COLUMNS: GridColDef[] = [
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
    <div style={{ height: 319, width: '100%' }}>
      <DataGridPro
        // The two following props are here to avoid scroll in the demo while we don't have pinned rows
        pagination
        pageSize={4}
        {...data}
        columns={COLUMNS}
        disableSelectionOnClick
        initialState={{
          rowGrouping: {
            model: ['company'],
          },
          aggregation: {
            model: {
              gross: { functionName: 'sum' },
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
