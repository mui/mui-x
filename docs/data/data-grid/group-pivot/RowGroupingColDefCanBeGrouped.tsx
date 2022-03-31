import * as React from 'react';
import { DataGridPro, GridColumns, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  useMovieData,
  useKeepGroupingColumnsHidden,
} from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company'];

export default function RowGroupingColDefCanBeGrouped() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const columnWithNoDirectorGroup = React.useMemo<GridColumns>(
    () =>
      columns.map((colDef) =>
        colDef.field === 'director' ? { ...colDef, groupable: false } : colDef,
      ),
    [columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        columns={columnWithNoDirectorGroup}
        disableSelectionOnClick
        initialState={{
          rowGrouping: {
            model: INITIAL_GROUPING_COLUMN_MODEL,
          },
        }}
        experimentalFeatures={{
          rowGrouping: true,
        }}
      />
    </div>
  );
}
