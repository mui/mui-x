import * as React from 'react';
import {
  DataGridPremium,
  gridVisibleSortedRowIdsSelector,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function RowGroupingSetChildrenExpansion() {
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

  const toggleSecondRow = () => {
    const rowIds = gridVisibleSortedRowIdsSelector(apiRef);

    if (rowIds.length > 1) {
      const rowId = rowIds[1];
      apiRef.current.setRowChildrenExpansion(
        rowId,
        !apiRef.current.getRowNode(rowId)?.childrenExpanded,
      );
    }
  };

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <Button onClick={toggleSecondRow}>Toggle 2nd row expansion</Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          disableSelectionOnClick
          initialState={initialState}
        />
      </div>
    </Stack>
  );
}
