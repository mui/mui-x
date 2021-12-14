import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

export default function GroupingColumnsInitialState() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        disableSelectionOnClick
        initialState={{
          groupingColumns: {
            model: INITIAL_GROUPING_COLUMN_MODEL,
          },
        }}
        experimentalFeatures={{
          groupingColumns: true,
        }}
      />
    </div>
  );
}
