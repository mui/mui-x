import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  useMovieData,
  useKeepGroupingColumnsHidden,
} from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

const isGroupExpandedByDefault = (node) =>
  node.groupingField === 'company' && node.groupingKey === '20th Century Fox';

export default function RowGroupingIsGroupExpandedByDefault() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        columns={columns}
        isGroupExpandedByDefault={isGroupExpandedByDefault}
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
