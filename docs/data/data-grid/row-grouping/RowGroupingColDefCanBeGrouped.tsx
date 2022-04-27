import * as React from 'react';
import {
  DataGridPremium,
  GridColumns,
  useGridApiRef,
  useKeepGroupingColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingColDefCanBeGrouped() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupingColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  const columnWithNoDirectorGroup = React.useMemo<GridColumns>(
    () =>
      data.columns.map((colDef) =>
        colDef.field === 'director' ? { ...colDef, groupable: false } : colDef,
      ),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        columns={columnWithNoDirectorGroup}
        disableSelectionOnClick
        initialState={initialState}
      />
    </div>
  );
}
