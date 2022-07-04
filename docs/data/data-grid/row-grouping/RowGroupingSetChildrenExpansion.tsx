import * as React from 'react';
import {
  DataGridPremium,
  gridVisibleSortedRowIdsSelector,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
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
    <Box sx={{ width: '100%' }}>
      <Button size="small" onClick={toggleSecondRow}>
        Toggle 2nd row expansion
      </Button>
      <Box sx={{ height: 400, pt: 1 }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          disableSelectionOnClick
          initialState={initialState}
        />
      </Box>
    </Box>
  );
}
