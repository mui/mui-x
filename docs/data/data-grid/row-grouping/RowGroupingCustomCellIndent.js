import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const groupingColDef = {
  offsetMultiplier: 6,
};

export default function RowGroupingCustomCellIndent() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={initialState}
        groupingColDef={groupingColDef}
      />
    </div>
  );
}
