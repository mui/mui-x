import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function GroupingColumnsDisabled() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        disableSelectionOnClick
        disableGroupingColumns
        experimentalFeatures={{
          groupingColumns: true,
        }}
      />
    </div>
  );
}
