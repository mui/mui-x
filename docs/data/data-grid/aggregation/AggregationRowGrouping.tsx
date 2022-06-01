import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
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

export default function AggregationRowGrouping() {
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
          gross: {
            // Aggregation displayed on the footers
            footer: 'max',
            // Aggregation displayed on the grouping rows
            inline: 'sum',
          },
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
        disableSelectionOnClick
        initialState={initialState}
      />
    </div>
  );
}
