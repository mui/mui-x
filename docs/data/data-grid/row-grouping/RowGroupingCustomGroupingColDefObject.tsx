import * as React from 'react';
import {
  DataGridPremium,
  GridGroupingColDefOverride,
  GridValidRowModel,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const groupingColDef: GridGroupingColDefOverride<GridValidRowModel> = {
  headerName: 'Group',
};

export default function RowGroupingCustomGroupingColDefObject() {
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
        disableRowSelectionOnClick
        initialState={initialState}
        groupingColDef={groupingColDef}
      />
    </div>
  );
}
