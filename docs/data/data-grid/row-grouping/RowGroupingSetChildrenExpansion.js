import * as React from 'react';
import {
  DataGridPremium,
  GRID_ROOT_GROUP_ID,
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

  const toggle2ndGroup = () => {
    const groups = apiRef.current.getRowNode(GRID_ROOT_GROUP_ID).children;

    if (groups.length > 1) {
      const groupId = groups[1];
      apiRef.current.setRowChildrenExpansion(
        groupId,
        !apiRef.current.getRowNode(groupId).childrenExpanded,
      );
    }
  };

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <Button onClick={toggle2ndGroup}>Toggle 2nd row expansion</Button>
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
