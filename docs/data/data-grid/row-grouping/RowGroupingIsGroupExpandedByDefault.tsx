import * as React from 'react';
import {
  DataGridPremium,
  GridRowTreeNodeConfig,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const isGroupExpandedByDefault = (node: GridRowTreeNodeConfig) =>
  node.groupingField === 'company' && node.groupingKey === '20th Century Fox';

export default function RowGroupingIsGroupExpandedByDefault() {
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
        isGroupExpandedByDefault={isGroupExpandedByDefault}
        disableSelectionOnClick
        initialState={initialState}
      />
    </div>
  );
}
