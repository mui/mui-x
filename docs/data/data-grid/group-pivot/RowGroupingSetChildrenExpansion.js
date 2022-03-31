import * as React from 'react';
import {
  DataGridPro,
  gridVisibleSortedRowIdsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  useMovieData,
  useKeepGroupingColumnsHidden,
} from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const INITIAL_GROUPING_COLUMN_MODEL = ['company'];

export default function RowGroupingSetChildrenExpansion() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

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
        <DataGridPro
          {...data}
          apiRef={apiRef}
          columns={columns}
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
    </Stack>
  );
}
