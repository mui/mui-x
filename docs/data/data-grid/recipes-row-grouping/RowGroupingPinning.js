import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingPinning() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
      pinnedColumns: { left: [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD] },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium {...data} apiRef={apiRef} initialState={initialState} />
    </div>
  );
}
