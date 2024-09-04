import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  isAutogeneratedRow,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: '__row_group_by_columns_group__', width: 200 },
  { field: 'company', width: 200 },
  {
    field: 'title',
    minWidth: 250,
    cellClassName: 'highlighted',
    valueGetter: (value, row) => {
      if (isAutogeneratedRow(row)) {
        return '[this is an autogenerated row]';
      }
      return `title: ${value}`;
    },
  },
  { field: 'year' },
];

export default function AutogeneratedRows() {
  const { rows } = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        initialState={initialState}
        defaultGroupingExpansionDepth={-1}
        sx={{
          '.MuiDataGrid-cell:not(.highlighted)': {
            color: '#999',
          },
        }}
      />
    </div>
  );
}
