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

export default function AggregationIsGroupAggregated() {
  const data = useMovieData();

  return (
    <div style={{ height: 318, width: '100%' }}>
      <DataGridPro
        {...data}
        columns={COLUMNS}
        disableSelectionOnClick
        initialState={{
          rowGrouping: {
            model: ['company', 'director'],
          },
          aggregation: {
            model: {
              gross: 'sum',
            },
          },
          columns: {
            columnVisibilityModel: {
              company: false,
              director: false,
            },
          },
        }}
        experimentalFeatures={{
          rowGrouping: true,
          aggregation: true,
        }}
        isGroupAggregated={(groupNode) => groupNode != null}
      />
    </div>
  );
}
