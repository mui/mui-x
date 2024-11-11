import * as React from 'react';
import {
  DataGridPremium,
  GridRowCountProps,
  useGridApiRef,
  useGridSelector,
  useKeepGroupedColumnsHidden,
  useGridApiContext,
  gridFilteredDescendantRowCountSelector,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';

function CustomFooterRowCount(props: GridRowCountProps) {
  const { visibleRowCount: topLevelRowCount } = props;
  const apiRef = useGridApiContext();
  const descendantRowCount = useGridSelector(
    apiRef,
    gridFilteredDescendantRowCountSelector,
  );

  return (
    <Box sx={{ mx: 2 }}>
      {descendantRowCount} row{descendantRowCount > 1 ? 's' : ''} in{' '}
      {topLevelRowCount} group
      {topLevelRowCount > 1 ? 's' : ''}
    </Box>
  );
}

export default function RowGroupingChildRowCount() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={initialState}
        slots={{
          footerRowCount: CustomFooterRowCount,
        }}
      />
    </div>
  );
}
