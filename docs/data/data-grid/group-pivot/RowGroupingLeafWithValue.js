import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  useMovieData,
  useKeepGroupingColumnsHidden,
} from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company'];

export default function RowGroupingLeafWithValue() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
    'title',
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        columns={columns}
        groupingColDef={{ leafField: 'title' }}
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
